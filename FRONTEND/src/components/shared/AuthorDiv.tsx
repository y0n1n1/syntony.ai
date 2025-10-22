import { Link } from "react-router-dom";

interface Author {
  id: string;
  name: string;
}

const AuthorDiv = ({ authors }: { authors: Author[] }) => {
  return (
    <div className="flex flex-row text-stone-500 text-sm">
      {authors.length <= 5 ? (
        authors.map((item, index) => (
          <span key={item.id}>
            <Link className="hover:underline pl-1" to={`/author/${item.id}`}>
              {item.name}
            </Link>
            {index < authors.length - 2 && ","}
            {index === authors.length - 2 && " and "}
          </span>
        ))
      ) : (
        <>
          {authors.slice(0, 5).map((item, index) => (
            <span key={item.id}>
              <Link className="hover:underline pl-1" to={`/author/${item.id}`}>
                {item.name}
              </Link>
              {index < 4 && ","}
            </span>
          ))}
          {"..."}
        </>
      )}
    </div>
  );
};

export default AuthorDiv;
