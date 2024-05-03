import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Editor } from "primereact/editor";
import { useState, useEffect, useRef } from 'react';

function App() {
  const [newId, setNewId] = useState(1);
  const [lastResult, setLastResult] = useState("");
  const [selectedResult, setSelectedResult] = useState("");
  const [value1, setValue1] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showSelectedResults, setShowSelectedResults] = useState(false);
  const [ids, setIds] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  const newTextInput = {};

  const incrementId = () => {
    setNewId((newId) => newId + 1);
    setIds(ids => [...ids, newId]);
  };
  useEffect(() => {
    getTexts();
  });
  useEffect(() => {
    postData();
  });
  useEffect(() => {
    getTextById();
  });

  const onClick = () => {
    setShowResults(false);
    setShowSelectedResults(false);
    incrementId();
    newTextInput.id = newId;
    newTextInput.text = value1;
    console.log(newTextInput);
    postData();
    alert("Your input has been saved.")
  };

  const displayRecent = () => {
    setShowSelectedResults(false);
    setShowResults(true);
    getTexts();
  }

  function getTexts() {
    fetch("http://localhost:8080/api/texts", {
      method: "GET"
    }).then((response) => response.json())
      .then((data) => {
        data.map((item) => {
          if(item.id === (newId-1)){
            setLastResult(item.text);
          }
        })
        console.log(newId);
        console.log(lastResult);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }

  function getTextById() {
    var URL = "http://localhost:8080/api/texts/"+selectedId;
    fetch(URL, {
      method: "GET"
    }).then((response) => response.json())
      .then((data) => {
        setSelectedResult(data.text);
        console.log(newId);
        console.log(selectedResult);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }

  function postData() {
    fetch("http://localhost:8080/api/add", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTextInput)
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  }

  const handleChange = (event) => {
    setShowResults(false);
    setShowSelectedResults(true);
    setSelectedId(event.target.value);
    getTextById();
  }
  console.log(selectedId);

  return (
    <>
    <div className='header'><h2 style={{textAlign: "center"}}>Rich Text Editor</h2></div>
    <div style={{padding: "75px", display: "flex", gap: "2rem"}}>
      <div style={{width: "50%"}}>
        <Editor
          value={value1}
          onTextChange={(e) => {
            setValue1(e.htmlValue)
          }}
          style={{height: "300px"}}/>
          <div className='buttonDiv'>
            <button className='button' onClick={onClick}>Submit</button>
            <select className='button' id='dropdown' value={selectedId} onChange={handleChange}>
              <option style={{backgroundColor: "white", color: "black"}}>Select...</option>
              {ids.map((id,index) => {
                return (
                  <option style={{backgroundColor: "white", color: "black"}} key={index} value={id}>
                    {id}
                  </option>
                );
              })}
            </select>
            <button className='button' onClick={displayRecent}>Display recent submission</button>
          </div>
      </div>
      <div style={{width: "50%"}}>
        <h4 style={{textAlign: "center"}}>Output</h4>
        { showResults && <div className='result' dangerouslySetInnerHTML={{ __html: lastResult }} /> }
        { showSelectedResults && <div className='result' dangerouslySetInnerHTML={{ __html: selectedResult }} /> }
      </div>
    </div>
    </>
  );
}

export default App;
