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
import org.apache.logging.log4j.util.MultiFormatStringBuilderFormattable
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
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.PBEParameterSpec
import org.apache.commons.codec.binary.Base64


class CreateVCardStepDefs {
	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("I start the vCard application")
	public void i_start_the_vCard_application() {
		Mobile.startApplication('Apks/app.apk', false)
	}

	@When("I insert {string} in the phone number field")
	public void i_insert_in_the_phone_number_field(String string) {
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Phone'), string, 0)
	}

	@When("I tap the {string} button")
	public void i_tap_the_button(String string) {
		Mobile.tap(findTestObject('Object Repository/android.widget.Button - '+string), 0)
	}

	@Then("I see the vCard creation page")
	public void i_see_the_vCard_creation_page() {
		Mobile.verifyElementText(findTestObject('Object Repository/android.widget.TextView - Aderir ao vCard'), 'Aderir ao vCard')
	}

	@Then("I insert {string} in the password field")
	public void i_insert_in_the_password_field(String string) {
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Password'), string, 0);
	}

	@Then("I insert {string} in the pin field")
	public void i_insert_in_the_pin_field(String string) {
		Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Pin'), string, 0)
	}

	@Then("I see the Menu page")
	public void i_see_the_Menu_page() {
		Mobile.verifyElementText(findTestObject('Object Repository/android.widget.TextView - Menu'), 'Menu')
	}
}