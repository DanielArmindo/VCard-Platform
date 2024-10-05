package stepDefinitions
import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.checkpoint.Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testcase.TestCase
import com.kms.katalon.core.testcase.TestCaseFactory
import com.kms.katalon.core.testdata.TestData
import com.kms.katalon.core.testdata.TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

import internal.GlobalVariable

import org.openqa.selenium.WebElement
import org.openqa.selenium.WebDriver
import org.openqa.selenium.By

import com.kms.katalon.core.mobile.keyword.internal.MobileDriverFactory
import com.kms.katalon.core.webui.driver.DriverFactory

import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.ResponseObject
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObjectProperty

import com.kms.katalon.core.mobile.helper.MobileElementCommonHelper
import com.kms.katalon.core.util.KeywordUtil

import com.kms.katalon.core.webui.exception.WebElementNotFoundException

import cucumber.api.java.en.And
import cucumber.api.java.en.Given
import cucumber.api.java.en.Then
import cucumber.api.java.en.When



class SendMoneyToAnotherUserStepDefs {
	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */	
	@Then("I see my contacts list")
	public void i_see_my_contacts_list() {
		Mobile.verifyElementText(findTestObject('android.widget.TextView - Contactos'), 'Contactos')
	}

	@Then("I choose the contact {string}")
	public void i_choose_the_contact(String string) {
		Mobile.scrollToText(string, FailureHandling.STOP_ON_FAILURE)
		Mobile.tap(findTestObject('android.widget.TextView - ' + string), 0)
	}

	@Then("I insert {string} in the value field")
	public void i_insert_in_the_value_field(String string) {
		Mobile.setText(findTestObject('android.widget.EditText - Valor'), string, 0)
	}

	@Then("I insert {string} in the description field")
	public void i_insert_in_the_description_field(String string) {
		Mobile.setText(findTestObject('android.widget.EditText - Description'), string, 0)
	}

	@Then("I see {string} information message")
	public void i_see_information_message(String string) {
		Mobile.verifyElementExist(findTestObject('android.widget.TextView - ' + string), 0)
	}

	@Then("I see the {string} page")
	public void i_see_the_page(String string) {
		Mobile.verifyElementText(findTestObject('android.widget.TextView - '+string), string)
	}

	@Then("I insert {string} in the name field")
	public void i_insert_in_the__number_field_and_in_name_the_field(String string) {
		// Write code here that turns the phrase above into concrete actions
		Mobile.setText(findTestObject('android.widget.EditText - Nome'), string, 0)
	}
}