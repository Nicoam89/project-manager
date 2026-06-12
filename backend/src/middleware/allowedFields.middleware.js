export const validateAllowedFields = (
  allowedFields
) => (req, res, next) => {
  const unknownFields = Object.keys(
    req.body || {}
  ).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return res.status(400).json({
      success: false,
      message:
        "Campos no permitidos en la solicitud",
      errors: unknownFields.map((field) => ({
        type: "field",
        value: req.body[field],
        msg: "Campo no permitido",
        path: field,
        location: "body",
      })),
    });
  }

  if (Object.keys(req.body || {}).length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "Debe enviar al menos un campo para actualizar",
      errors: [],
    });
  }

  next();
};
