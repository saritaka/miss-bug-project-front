import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { BugList } from "../cmps/BugList.jsx";
import { BugFilter } from "../cmps/BugFilter.jsx";
import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { utilService } from "../services/util.service.js";

export function BugIndex() {
  const [bugs, setBugs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultFilter = bugService.getFilterFromSearchParams(searchParams);
  const [filterBy, setFilterBy] = useState(defaultFilter);

  const debouncedSetFilterBy = useCallback(
    utilService.debounce(setFilterBy, 1000),
    []
  );

  useEffect(() => {
    setSearchParams(filterBy);
    bugService
      .query(filterBy)
      .then((bugs) => setBugs(bugs))
      .catch((err) => {
        console.error("err:", err);
      });
    // loadBugs();
  }, [filterBy]);

  // async function loadBugs() {
  //   const bugs = await bugService.query();
  //   setBugs(bugs);
  // }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId);
      console.log("Deleted Succesfully!");
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
      showSuccessMsg("Bug removed");
    } catch (err) {
      console.log("Error from onRemoveBug ->", err);
      showErrorMsg("Cannot remove bug");
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      severity: +prompt("Bug severity?"),
      description: prompt("Bug description:"),
      // labels: prompt("Bug labels: critical, need-CR, dev-branch"),
    };
    try {
      const savedBug = await bugService.save(bug);
      console.log("Added Bug", savedBug);
      setBugs((prevBugs) => [...prevBugs, savedBug]);
      showSuccessMsg("Bug added");
    } catch (err) {
      console.log("Error from onAddBug ->", err);
      showErrorMsg("Cannot add bug");
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt("New severity?");
    const bugToSave = { ...bug, severity };
    try {
      const savedBug = await bugService.save(bugToSave);
      console.log("Updated Bug:", savedBug);
      setBugs((prevBugs) =>
        prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
      );
      showSuccessMsg("Bug updated");
    } catch (err) {
      console.log("Error from onEditBug ->", err);
      showErrorMsg("Cannot update bug");
    }
  }

  return (
    <main className="bug-index">
      <h3>Bugs App</h3>

      <main>
        {/* <BugFilter filterBy={filterBy} onSetFilterBy={setFilterBy} /> */}
        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy} />
        <button className="add-btn" onClick={onAddBug}>
          Add Bug ⛐
        </button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  );
}
