import { computed, onMounted, onUnmounted, ref, unref, watch } from 'vue';
import { getCurrentUser, getUserSettings } from '@/utils/user-settings';

const DEFAULT_CURRENCY = 'USD';
const BASE_CURRENCY = 'USD';
const SUPPORTED_CURRENCIES = ['USD', 'GHS', 'EUR', 'GBP'];
const EXCHANGE_RATE_CACHE_KEY = 'finflow-exchange-rates-v1';
const EXCHANGE_RATE_CACHE_TTL_MS = 1000 * 60 * 60 * 12;
// Use exchangerate.host which supports a wide set of currencies without API key
const EXCHANGE_RATE_ENDPOINT = (base = BASE_CURRENCY) => {
  const symbols = SUPPORTED_CURRENCIES.filter((c) => c !== base).join(',');
  return `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(
    symbols,
  )}`;
};

const displayCurrency = ref(DEFAULT_CURRENCY);
const liveExchangeRatesEnabled = ref(false);
const exchangeRates = ref({ USD: 1 });
const exchangeRatesUpdatedAt = ref('');
const exchangeRatesError = ref('');
const isExchangeRatesLoading = ref(false);
let exchangeRatesRequest = null;

const readCachedExchangeRates = () => {
  const cachedValue = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);

  if (!cachedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(cachedValue);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.timestamp !== 'number' ||
      !parsed.rates ||
      typeof parsed.rates !== 'object'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeCachedExchangeRates = (payload) => {
  localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify(payload));
};

const loadExchangeRates = async ({ force = false } = {}) => {
  const cached = readCachedExchangeRates();

  if (
    !force &&
    cached &&
    Date.now() - cached.timestamp < EXCHANGE_RATE_CACHE_TTL_MS
  ) {
    exchangeRates.value = cached.rates;
    exchangeRatesUpdatedAt.value = cached.updatedAt;
    exchangeRatesError.value = '';
    return cached.rates;
  }

  if (exchangeRatesRequest) {
    return exchangeRatesRequest;
  }

  isExchangeRatesLoading.value = true;
  const endpoint = EXCHANGE_RATE_ENDPOINT(BASE_CURRENCY);

  exchangeRatesRequest = fetch(endpoint)
    .then(async (response) => {
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || 'Could not load exchange rates.');
      }

      const nextRates = { USD: 1 };

      SUPPORTED_CURRENCIES.forEach((c) => {
        if (c === BASE_CURRENCY) return;
        nextRates[c] = Number(payload?.rates?.[c] ?? exchangeRates.value[c] ?? 0) || 0;
      });

      const nextUpdatedAt = payload?.date || new Date().toISOString().slice(0, 10);

      exchangeRates.value = nextRates;
      exchangeRatesUpdatedAt.value = nextUpdatedAt;
      exchangeRatesError.value = '';

      writeCachedExchangeRates({
        timestamp: Date.now(),
        updatedAt: nextUpdatedAt,
        rates: nextRates,
      });

      return nextRates;
    })
    .catch((error) => {
      const cachedFallback = readCachedExchangeRates();

      if (cachedFallback) {
        exchangeRates.value = cachedFallback.rates;
        exchangeRatesUpdatedAt.value = cachedFallback.updatedAt;
      }

      exchangeRatesError.value = error instanceof Error ? error.message : 'Could not load exchange rates.';

      return exchangeRates.value;
    })
    .finally(() => {
      isExchangeRatesLoading.value = false;
      exchangeRatesRequest = null;
    });

  return exchangeRatesRequest;
};

const resolveUserId = (userSource) => {
  if (userSource === undefined) {
    return getCurrentUser()?.user_id ?? null;
  }

  const value = unref(userSource);

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return value?.user_id ?? null;
};

export const useDisplayCurrency = (userSource) => {
  const refreshCurrencyPreference = () => {
    const userId = resolveUserId(userSource);
    const savedSettings = getUserSettings(userId);
    const savedCurrency = savedSettings.currency;

    liveExchangeRatesEnabled.value = Boolean(savedSettings.useLiveExchangeRates);

    displayCurrency.value = SUPPORTED_CURRENCIES.includes(savedCurrency)
      ? savedCurrency
      : DEFAULT_CURRENCY;
  };

  const convertAmount = (amount) => {
    const numericAmount = Number(amount || 0);
    const selectedCurrency = liveExchangeRatesEnabled.value ? displayCurrency.value : BASE_CURRENCY;

    if (!Number.isFinite(numericAmount)) {
      return 0;
    }

    if (selectedCurrency === BASE_CURRENCY) {
      return numericAmount;
    }

    if (!liveExchangeRatesEnabled.value) {
      return numericAmount;
    }

    const rate = Number(exchangeRates.value[selectedCurrency] || 0);

    // If we don't have a usable rate yet, trigger a background load and return the base amount for now.
    if (!rate || rate <= 0) {
      // Fire-and-forget: fetch live rates so the UI updates when they arrive
      loadExchangeRates().catch(() => {});
      return numericAmount;
    }

    return numericAmount * rate;
  };

  const formatCurrency = (amount, options = {}) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: liveExchangeRatesEnabled.value ? displayCurrency.value : BASE_CURRENCY,
      maximumFractionDigits: 2,
      ...options,
    }).format(convertAmount(amount));

  const exchangeRateStatus = computed(() => {
    if (!liveExchangeRatesEnabled.value) {
      return 'Live exchange rates are turned off.';
    }

    if (exchangeRatesError.value && !exchangeRatesUpdatedAt.value) {
      return 'Live rates unavailable. Values are shown using the base USD amounts.';
    }

    if (exchangeRatesUpdatedAt.value) {
      return `Live exchange rates last updated on ${exchangeRatesUpdatedAt.value}.`;
    }

    return 'Fetching live exchange rates...';
  });

  onMounted(() => {
    refreshCurrencyPreference();

    if (liveExchangeRatesEnabled.value) {
      // If the user prefers a non-base currency, eagerly fetch live rates immediately.
      if (displayCurrency.value && displayCurrency.value !== BASE_CURRENCY) {
        loadExchangeRates({ force: true });
      } else {
        loadExchangeRates();
      }
    }

    window.addEventListener('finflow-settings-updated', refreshCurrencyPreference);
  });

  onUnmounted(() => {
    window.removeEventListener('finflow-settings-updated', refreshCurrencyPreference);
  });

  watch(
    () => resolveUserId(userSource),
    () => {
      refreshCurrencyPreference();
    },
    { immediate: true },
  );

  return {
    displayCurrency,
    liveExchangeRatesEnabled,
    exchangeRateStatus,
    exchangeRatesUpdatedAt,
    exchangeRatesError,
    isExchangeRatesLoading,
    convertAmount,
    formatCurrency,
    refreshCurrencyPreference,
    refreshExchangeRates: loadExchangeRates,
  };
};
