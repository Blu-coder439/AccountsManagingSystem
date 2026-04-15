export const json = (data, init = {}) =>
  Response.json(data, {
    headers: {
      'Cache-Control': 'no-store',
      ...(init.headers || {}),
    },
    ...init,
  });

export const errorResponse = (status, error, details) =>
  json(
    {
      error,
      ...(details ? { details } : {}),
    },
    { status },
  );

export const methodNotAllowed = (allowedMethods) =>
  json(
    { error: 'Method not allowed' },
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(', '),
      },
    },
  );

export const parseJsonBody = async (request) => {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON body.');
  }
};
