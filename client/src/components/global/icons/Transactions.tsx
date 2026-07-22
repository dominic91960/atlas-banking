const Transactions: React.FC<React.SVGProps<SVGSVGElement>> = ({
  fill = "var(--color-neutral-100)",
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 5H18M14 0L19 5L14 10M20 15H2M6 10L1 15L6 20"
        stroke={fill}
        stroke-width="2"
      />
    </svg>
  );
};

export default Transactions;
