import { createQueryDictionary } from "./index";
import {
  createValidationState,
  verifyNames,
  verifyAge,
  verifyPhoneUK,
  verifyEmail,
} from "./index";

test("dictionary of required inputs is created", () => {
  const emptyQueryDictionary: { [key: string]: string } = {};

  expect(createQueryDictionary(emptyQueryDictionary)).toContain("title");
  expect(createQueryDictionary(emptyQueryDictionary)).toContain("firstname");
  expect(createQueryDictionary(emptyQueryDictionary)).toContain("lastname");
  expect(createQueryDictionary(emptyQueryDictionary)).toContain("birthdate");
  expect(createQueryDictionary(emptyQueryDictionary)).toContain("phone");
  expect(createQueryDictionary(emptyQueryDictionary)).toContain("email");
  expect(createQueryDictionary(emptyQueryDictionary)).toContain(
    "actionForceSubmit"
  );
});

test("state object contains a key for each input", () => {
  const firstnameInput = <HTMLInputElement>(
    document.getElementById("first-name")
  );
  const lastnameInput = <HTMLInputElement>document.getElementById("last-name");
  const firstName = firstnameInput.value;
  const lastName = lastnameInput.value;
  const firstNameIsValid: boolean = verifyNames(firstName);
  const lastNameIsValid: boolean = verifyNames(lastName);

  const dateInput = <HTMLInputElement>document.getElementById("birth-date");
  const age = dateInput.value;
  const over18: boolean = verifyAge(age);

  const phoneInput = <HTMLInputElement>document.getElementById("telephone");
  const phoneNumber = phoneInput.value;
  const phoneIsFromUK = verifyPhoneUK(phoneNumber);

  const emailInput = <HTMLInputElement>document.getElementById("email-address");
  const emailAddress = emailInput.value;
  const emailIsValid = verifyEmail(emailAddress);

  const validationState: { [key: string]: string } = {};

  expect(
    createValidationState(validationState, firstNameIsValid, "firstname")
  ).toContain("firstname");
  expect(
    createValidationState(validationState, lastNameIsValid, "lastname")
  ).toContain("lastname");
  expect(createValidationState(validationState, over18, "age")).toContain(
    "age"
  );
  expect(
    createValidationState(validationState, phoneIsFromUK, "phone")
  ).toContain("phone");
  expect(
    createValidationState(validationState, emailIsValid, "email")
  ).toContain("email");
});
