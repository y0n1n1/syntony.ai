import React, { Dispatch, SetStateAction } from 'react';

interface SearchFilterFormProps {
  formValues: {
    authors: string;
    startDate: string;
    endDate: string;
    titlesIncludes: string;
    abstractsIncludes: string;
    categories: string;
  };
  setFormValues: Dispatch<SetStateAction<{
    authors: string;
    startDate: string;
    endDate: string;
    titlesIncludes: string;
    abstractsIncludes: string;
    categories: string;
  }>>;
}

const SearchFilterForm: React.FC<SearchFilterFormProps> = ({ formValues, setFormValues }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="authors">Authors</label>
        <input
          type="text"
          id="authors"
          name="authors"
          value={formValues.authors}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formValues.startDate}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formValues.endDate}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="titlesIncludes">Titles Includes</label>
        <input
          type="text"
          id="titlesIncludes"
          name="titlesIncludes"
          value={formValues.titlesIncludes}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="abstractsIncludes">Abstracts Includes</label>
        <input
          type="text"
          id="abstractsIncludes"
          name="abstractsIncludes"
          value={formValues.abstractsIncludes}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="categories">Categories</label>
        <input
          type="text"
          id="categories"
          name="categories"
          value={formValues.categories}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
    </div>
  );
};

export default SearchFilterForm;
