export const GridBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </div>
  );
};
