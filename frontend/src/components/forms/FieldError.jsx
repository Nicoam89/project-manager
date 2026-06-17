const FieldError = ({
  children,
  id,
}) => {
  if (!children) {
    return null;
  }

  return (
    <p
      id={id}
      role="alert"
      className="mt-2 text-sm text-red-600"
    >
      {children}
    </p>
  );
};

export default FieldError;
