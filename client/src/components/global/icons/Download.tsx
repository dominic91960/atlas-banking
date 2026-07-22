const Download: React.FC<React.SVGProps<SVGSVGElement>> = ({
  fill = "var(--color-neutral-100)",
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 18L4.5 10.5L6.6 8.325L10.5 12.225V0H13.5V12.225L17.4 8.325L19.5 10.5L12 18ZM3 24C2.175 24 1.469 23.7065 0.882 23.1195C0.295 22.5325 0.001 21.826 0 21V16.5H3V21H21V16.5H24V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z"
        fill={fill}
      />
    </svg>
  );
};

export default Download;
