"use strict";

document.addEventListener("DOMContentLoaded", init);
let jsonData;
let bloodStatus = [];
let Student = {
  firstname: "-student-firstname-",
  lastname: "-student-lastname-",
  house: "-student-house-",
  blood: "-bloodstatus-",
  iSquad: "-inquisitorial-squad-",
  fromJSON(jsonObject) {
    const lastIndexOfName = jsonObject.fullname.lastIndexOf(" ");
    const lengthName = jsonObject.fullname.length;
    const lastName = jsonObject.fullname.slice(lastIndexOfName + 1, lengthName);
    this.firstname = jsonObject.fullname.slice(0, lastIndexOfName);
    this.lastname = lastName;
    this.house = jsonObject.house;
    this.iSquad = "not a member";
    this.image = (lastName + "_" + jsonObject.fullname.slice(0, 1)).toString();
    this.blood = checkBlood(lastName);
    function checkBlood(lastName) {
      if (bloodStatus[0].half.includes(lastName)) {
        return "half";
      } else if (bloodStatus[0].pure.includes(lastName)) {
        return "pure";
      } else {
        return "muggle";
      }
    }
  }
};
let allStudents = [];
let expelledStudents = [];
let inquisitorialSquad = [];
let filterType;
let filtered;
let sorted;

function init() {
  hentBloodJson();
}

//"BLOOD-STATUS" FRA JSON
function hentBloodJson() {
  fetch("http://petlatkea.dk/2019/hogwarts/families.json")
    .then(response => response.json())
    .then(bloodJson => {
      bloodStatus.push(bloodJson);
      hentJson();
      return bloodStatus;
    });
}

//HENTER/LOADER JSON
function hentJson() {
  //Studentlist
  fetch("http://petlatkea.dk/2019/hogwarts/students.json")
    .then(response => response.json())
    .then(myJson => {
      // Når JSON er loaded:
      prepareObjects(myJson);
    });
}

//FORBEREDER OBJECTER
function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    //laver et nyt object
    const student = Object.create(Student);
    student.fromJSON(jsonObject);

    // Gemmer det i et globalt array - se øverst
    allStudents.push(student);
  });
  addingMyself();
  filterHouse();
  displayList(allStudents);
}

//FILTERING
function filterHouse() {
  // Filtreringsknapper
  document
    .querySelector("#gryffindor")
    .addEventListener("click", filterGryffindor);
  document
    .querySelector("#hufflepuff")
    .addEventListener("click", filterHufflepuff);
  document
    .querySelector("#rawenclaw")
    .addEventListener("click", filterRawenclaw);
  document
    .querySelector("#slytherin")
    .addEventListener("click", filterSlytherin);
  document.querySelector("#all").addEventListener("click", filterAll);
}

function filterAll() {
  filtered = allStudents;
  sortList(filtered);
  filterHouse();
}
function filterGryffindor() {
  filterType = "Gryffindor";
  filtered = filterByType(filterType);
  sortList(filtered);
  filterHouse();
}
function filterGryffindor() {
  filterType = "Gryffindor";
  filtered = filterByType(filterType);
  sortList(filtered);
  filterHouse();
}
function filterHufflepuff() {
  filterType = "Hufflepuff";
  filtered = filterByType(filterType);
  sortList(filtered);
  filterHouse();
}
function filterRawenclaw() {
  filterType = "Ravenclaw";
  filtered = filterByType(filterType);
  sortList(filtered);
  filterHouse();
}
function filterSlytherin() {
  filterType = "Slytherin";
  filtered = filterByType(filterType);
  sortList(filtered);
  filterHouse();
}
function filterByType(house) {
  function filterType(person) {
    return person.house === house;
  }
  return allStudents.filter(filterType);
}

// SORTERING
function sortList(list) {
  document.querySelector("#house").addEventListener("click", sortByHouse);
  document.querySelector("#firstName").addEventListener("click", sortByFirst);
  document.querySelector("#lastName").addEventListener("click", sortByLast);

  displayList(list);
}

function sortByHouse() {
  function sortHouse(a, b) {
    if (a.house < b.house) {
      return -1;
    } else {
      return 1;
    }
  }
  sorted = filtered.sort(sortHouse);
  displayList(sorted);
}

function sortByFirst() {
  function sortFirstname(a, b) {
    if (a.firstname < b.firstname) {
      return -1;
    } else {
      return 1;
    }
  }
  sorted = filtered.sort(sortFirstname);
  displayList(sorted);
}

function sortByLast() {
  function sortLastname(a, b) {
    if (a.lastname < b.lastname) {
      return -1;
    } else {
      return 1;
    }
  }
  sorted = filtered.sort(sortLastname);
  displayList(sorted);
}

// DISPLAY
function displayList(list) {
  countStudent();
  document.querySelector(".list").innerHTML = "";

  list.forEach(displayStudent);
}

function displayStudent(list) {
  newBloodStatus(list);
  const clone = document
    .querySelector("#persontemplate")
    .content.cloneNode(true);
  clone.querySelector("[data-field=firstName]").textContent = list.firstname;
  clone.querySelector("[data-field=lastName]").textContent = list.lastname;
  clone.querySelector("[data-field=house]").textContent = list.house;

  // bortvis den studerende
  clone.querySelector("#expelButton").addEventListener("click", () => {
    if (list.firstname == "Lene") {
      dontExpel();
    } else {
      expelStudent(list);
    }
  });

  // Tilføj den studerende til IS
  clone.querySelector("#appointButton").addEventListener("click", event => {
    if (list.blood == "pure") {
      if (list.house == "Slytherin") {
        appointStudent(event, list);
      } else {
        alert("this student isn't a Slytherin");
      }
    } else {
      alert("This student isn't a pure-blood");
    }
  });

  // åben modal-vindue
  clone.querySelector(".person").addEventListener("click", () => {
    showModal(list);
  });

  document.querySelector(".list").appendChild(clone);
}

//MODAL VINDUE
function showModal(list) {
  let houseStyle = list.house.toString().toLowerCase();

  document.querySelector(".modal").style.display = "block";
  document.querySelector("[data-modal=modalFirst]").textContent =
    list.firstname;
  document.querySelector("[data-modal=modalLast]").textContent = list.lastname;
  document.querySelector("[data-modal=modalHouse]").textContent = list.house;
  document.querySelector("[data-modal=bloodstatus]").textContent = list.blood;
  document.querySelector("[data-modal=inquisitorialSquad]").textContent =
    list.iSquad;
  document
    .querySelector("[data-modal=modalHouseImg]")
    .setAttribute("src", "images/" + list.house.toLowerCase() + "_logo.png");

  document
    .querySelector("[data-modal=modalImage]")
    .setAttribute("src", "student-images/" + list.image.toLowerCase() + ".png");

  document
    .querySelector("[data-modal=modal-content]")
    .classList.add(houseStyle);

  // luk modal-vinduet
  document.querySelector("#closeModal").addEventListener("click", () => {
    closeModal(houseStyle);
  });
}

function closeModal(houseStyle) {
  document
    .querySelector("[data-modal=modal-content]")
    .classList.remove(houseStyle);
  document.querySelector(".modal").style.display = "none";
}

//EXPEL A STUDENT

function expelStudent(list) {
  let toBeRemove = findByName(list.firstname);
  expelledStudents.push(list);

  function removeStudent(obj) {
    const pos = allStudents.indexOf(obj);
    allStudents.splice(pos, 1);
  }

  function findByName(studentName) {
    return allStudents.find(obj => obj.firstname === studentName);
  }

  removeStudent(toBeRemove);
  filterAll();
}

//APPOINT THE STUDENT TO IS
function appointStudent(event, list) {
  event.target.style.backgroundColor = "pink";
  event.target.innerHTML = "remove from inquisitorial Squad";
  list.iSquad = "member";
  setTimeout(timerOnIS, 2000, event, list);
  event.target.addEventListener("click", ev => {
    removeFromIS(ev, list);
  });

  return list.iSquad;
}

function removeFromIS(ev, list) {
  ev.target.style.backgroundColor = "";
  ev.target.innerHTML = "add from inquisitorial Squad";
  list.iSquad = "not a member";
  ev.target.addEventListener("click", event => {
    appointStudent(event, list);
  });
  return list.iSquad;
}

//STATUS OVER DE STUDERENDE
function countStudent() {
  const counts = {
    Gryffindor: 0,
    Slytherin: 0,
    Hufflepuff: 0,
    Ravenclaw: 0
  };
  allStudents.forEach(student => {
    counts[student.house]++;
  });

  displayCountStudent(counts);
}

function displayCountStudent(counts) {
  document.querySelector("#hogwartsStudent").innerHTML =
    "Students at hogwarts: " + allStudents.length;
  document.querySelector("#gryffindorStudent").innerHTML =
    "Gryffindor students: " + counts.Gryffindor;
  document.querySelector("#hufflepuffStudent").innerHTML =
    "Hufflepuff students: " + counts.Hufflepuff;
  document.querySelector("#ravenclawStudent").innerHTML =
    "Ravenclaw students: " + counts.Ravenclaw;
  document.querySelector("#slytherinStudent").innerHTML =
    "Slytherin students: " + counts.Slytherin;
  document.querySelector("#expeltStudent").innerHTML =
    "Currently expelled: " + expelledStudents.length;
}

////////////////////// "THE HACKING PART" ////////////////////////

function addingMyself() {
  const lene = {
    firstname: "Lene",
    lastname: "Froekjaer",
    house: "Ravenclaw",
    iSquad: "not a member",
    image: "Froekjaer_L",
    blood: "pure"
  };
  allStudents.push(lene);
  return allStudents;
}

function dontExpel() {
  setTimeout(messageTimer, 3500);
  document.querySelector("#pop_up").style.display = "block";
  function messageTimer() {
    document.querySelector("#pop_up").style.display = "none";
  }
}

// setting all the students with half- or muggle-blood to have pure blood.
// And all the students with pure blood to have randomly half- or muggle-blood.
function newBloodStatus(list) {
  if (list.firstname == "Lene") {
    list.blood = "pure";
    return list.blood;
  } else if (list.blood == "half") {
    list.blood = "pure";
    return list.blood;
  } else if (list.blood == "muggle") {
    list.blood = "pure";
    return list.blood;
  } else {
    let n = Math.floor(Math.random() * Math.floor(2));
    if (n === 1) {
      list.blood = "half";
      return list.blood;
    } else {
      list.blood = "muggle";
      return list.blood;
    }
  }
}

function timerOnIS(event, list) {
  event.target.style.backgroundColor = "orange";
  event.target.innerHTML = "whoops!";
  setTimeout(removeFromIS, 2000, event, list);
}
