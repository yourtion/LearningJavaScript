export const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) {
    return <span>{name}</span>;
  }
  const arr = name.split(keyword);
  return (
    <>
      {arr.map((str, idx) => (
        <span key={idx}>
          {str}
          {idx === arr.length - 1 ? null : <span style={{ color: '#257AFD' }}>{keyword}</span>}
        </span>
      ))}
    </>
  );
};
