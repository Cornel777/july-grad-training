import "../styles.css";

window.onload = (e: Event) => {
  init();
  displaySuccesMessage();
};

function displaySuccesMessage() {
  const queryParams = parseQueryParams();

  const isSubmitted = queryParams.submitAuto;
  const params: { [key: string]: string } = queryParams.filledQueryDictionary;
  
  if (isSubmitted === "submitted") createSuccessMessage(params);
}

let result = <HTMLElement>document.getElementById("submit-report");

function createSuccessMessage(params: { [key: string]: string }) {
  const customerTitle = params.title;
  const customerFirtsName = params.firstname;
  const customerLastName = params.lastname;
  result.innerHTML = `&#9989; Your order has been sent <strong>${customerTitle} ${customerFirtsName} ${customerLastName}</strong> !`;
}

function parseQueryParams() {
  let searchParams = new URLSearchParams(window.location.search);
  let submitAuto = searchParams.get("actionForceSubmit");

  const emptyQueryDictionary: { [key: string]: string } = {};
  const filledQueryDictionary = createQueryDictionary(emptyQueryDictionary);

  return { submitAuto, filledQueryDictionary };
}

export function createQueryDictionary(dictionary: {
  [key: string]: string;
}): {} {
  window.location.search
    .slice(1)
    .split("&")
    .map((elem) => {
      let queryKey: string = elem.split("=")[0];
      let queryValue: string = elem.split("=")[1];

      dictionary[queryKey] = queryValue;
    });

  return dictionary;
}

let aboutForm = <HTMLFormElement>document.getElementById("about-form");
function init() {
  aboutForm.addEventListener("submit", submitHandler.bind(this));
}

interface keyable {
  [key: string]: any;
}

const inputValidationErrorMessages: keyable = {
  firstnameIsInvalid: "&#9940; Please enter a valid first name!",
  lastnameIsInvalid: "&#9940; Please enter a valid  surname!",
  ageIsInvalid: "&#9940; You must be older than 18 years of age!",
  phoneIsInvalid: "&#9940; Please use an UK phone number!",
  emailIsInvalid: "&#9940; Email address entered is not a valid address!",
};

const firstnameError = document.getElementById("firstname-invalid");
const lastnameError = document.getElementById("lastname-invalid");
const birthdateError = document.getElementById("date-invalid");
const phoneError = document.getElementById("telephone-invalid");
const emailError = document.getElementById("email-invalid");

const validationState: { [key: string]: string } = {};

function submitHandler(e: Event) {
  e.preventDefault();

  const firstNameIsValid: boolean = validateFirstname();
  const lastNameIsValid: boolean = validateLastname();
  const over18: boolean = validateBirthDate();
  const phoneIsFromUK: boolean = validatePhone();
  const emailIsValid: boolean = validateEmail();

  createValidationState(validationState, firstNameIsValid, "firstname");
  createValidationState(validationState, lastNameIsValid, "lastname");
  createValidationState(validationState, over18, "age");
  createValidationState(validationState, phoneIsFromUK, "phone");
  createValidationState(validationState, emailIsValid, "email");

  

  let formIsValid = checkFormValidationState();

  outputErrorMessage(
    validationState.firstname,
    firstnameError,
    inputValidationErrorMessages.firstnameIsInvalid
  );

  outputErrorMessage(
    validationState.lastname,
    lastnameError,
    inputValidationErrorMessages.lastnameIsInvalid
  );
  outputErrorMessage(
    validationState.age,
    birthdateError,
    inputValidationErrorMessages.ageIsInvalid
  );
  outputErrorMessage(
    validationState.phone,
    phoneError,
    inputValidationErrorMessages.phoneIsInvalid
  );
  outputErrorMessage(
    validationState.email,
    emailError,
    inputValidationErrorMessages.emailIsInvalid
  );

  forceSubmit(formIsValid);
}

function validateFirstname(): boolean {
  const firstnameInput = <HTMLInputElement>(
    document.getElementById("first-name")
  );
  const firstName = firstnameInput.value;
  return verifyNames(firstName);
}
function validateLastname(): boolean {
  const lastnameInput = <HTMLInputElement>document.getElementById("last-name");
  const lastName = lastnameInput.value;
  return verifyNames(lastName);
}
function validateBirthDate(): boolean {
  const dateInput = <HTMLInputElement>document.getElementById("birth-date");
  const age = dateInput.value;
  return verifyAge(age);
}
function validatePhone(): boolean {
  const phoneInput = <HTMLInputElement>document.getElementById("telephone");
  const phoneNumber = phoneInput.value;
  return verifyPhoneUK(phoneNumber);
}
function validateEmail(): boolean {
  const emailInput = <HTMLInputElement>document.getElementById("email-address");
  const emailAddress = emailInput.value;
  return verifyEmail(emailAddress);
}

function checkFormValidationState(): boolean {
  for (let key in validationState) {
    if (validationState[key] == "invalid") {
      return false;
    }
  }
  return true;
}

function forceSubmit(formIsValid: boolean) {
  if (formIsValid) aboutForm.submit();
}

function outputErrorMessage(
  inputToCheck: string,
  outputLocation: HTMLElement,
  message: string
): void {
  if (inputToCheck !== "valid") {
    outputLocation.innerHTML = message;
  } else {
    outputLocation.innerHTML = "";
  }
}

export function createValidationState(
  state: { [key: string]: string },
  inputState: boolean,
  key: string
): void {
  if (inputState) {
    state[key] = "valid";
  } else {
    state[key] = "invalid";
  }
}

export function verifyNames(name: string): boolean {
  const regexAlphaNum = /^[a-zA-Z0-9_]*$/;

  if (typeof name !== "string") return false;
  if (!regexAlphaNum.test(name)) return false;

  return true;
}

export function verifyAge(date: string): boolean {
  let regexDateFormat =
    /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;

  const formattedDate = date.split("-").reverse().join("/");

  if (regexDateFormat.test(formattedDate)) {
    const deconstrunctedDate = formattedDate.split("/");
    const bdayObject = new Date(
      deconstrunctedDate[1] +
        "/" +
        deconstrunctedDate[0] +
        "/" +
        deconstrunctedDate[2]
    );

    const bdayYear = bdayObject.getFullYear();
    const bdayMonth = bdayObject.getMonth();
    const bdayDay = bdayObject.getDate();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    if (currentYear - bdayYear < 18) return false;

    if (currentYear - bdayYear == 18) {
      if (currentMonth < bdayMonth) return false;

      if (currentMonth == bdayMonth) {
        if (currentDay < bdayDay) return false;
      }
    }

    return true;
  }
}

export function verifyPhoneUK(phoneNumber: string): boolean {
  const regexPhoneUK = /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/;

  if (!regexPhoneUK.test(phoneNumber)) return false;

  return true;
}

export function verifyEmail(email: string): boolean {
  const regexValidEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!regexValidEmail.test(email)) return false;

  return true;
}
