import { useState, useEffect } from "react";

export function BugFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });

  console.log("filter by to edit in bugfilter,jsx", filterByToEdit);
  useEffect(() => {
    onSetFilterBy(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange({ target }) {
    const field = target.name;
    let value = target.value;
    console.log("filed, value:", field, value);
    // if ((target.type = "number")) {
    //   value = +value || "";
    // }
    console.log("filed, type of value:", field, typeof value);

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  function onSubmitFilter(ev) {
    ev.preventDefault();
    onSetFilterBy(filterByToEdit);
  }

  const { txt, severity, label, sortBy } = filterByToEdit;

  return (
    <article>
      <section className="filter">
        <h4>Find Bug:</h4>
        <form>
          <label htmlFor="txt">Search bug: </label>
          <input
            type="txt"
            value={txt}
            name="txt"
            placeholder="Bug title"
            id="txt"
            onChange={handleChange}
          ></input>
          <label htmlFor="severity">Severity: </label>
          <input
            type="number"
            value={severity}
            name="severity"
            id="severity"
            placeholder="Min severity"
            onChange={handleChange}
          ></input>
          <label htmlFor="labels">Labels: </label>
          {/* <select value={label} multiple name="labels" id="labels" onChange={handleChange}> */}
          <select value={label} id="label" name="label" onChange={handleChange}>
            <option value="all">Select label</option>
            <option value="critical">critical</option>
            <option value="need-CR">need-CR</option>
            <option value="dev-branch">dev-branch</option>
          </select>
          <button onClick={onSubmitFilter}>Set Filter</button>
        </form>
      </section>
      <div>
        Sort By:
        <select
          value={sortBy}
          onChange={handleChange}
          id="sortBy"
          name="sortBy"
        >
          <option value="">Select Sorting</option>
          <option value="title">Title</option>
          <option value="severity">Severity</option>
          <option value="createdAt">Created at</option>
        </select>
      </div>
    </article>
  );
}
