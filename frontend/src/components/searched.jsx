import React from "react";

const Searched = ({ searchResults }) => {
  console.log("serach", searchResults);

  if (searchResults.length === 0) {
    return (
      <div className="absolute container mx-auto top-14 text-center">
        <p>No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-4">
      <ul>
        {searchResults.map((expense) => (
          <li key={expense.id} className="p-2 border-b">
            {expense.description} - {expense.price} - {expense.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Searched;
