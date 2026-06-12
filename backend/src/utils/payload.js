export const pickAllowedFields = (
  payload,
  allowedFields
) => {
  const safePayload = {};

  for (const field of allowedFields) {
    if (
      Object.prototype.hasOwnProperty.call(
        payload,
        field
      )
    ) {
      safePayload[field] = payload[field];
    }
  }

  return safePayload;
};
