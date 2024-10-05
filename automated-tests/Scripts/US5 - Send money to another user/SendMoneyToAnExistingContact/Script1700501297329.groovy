import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import cucumber.api.java.en.Then as Then
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys


Mobile.startApplication('Apks/app.apk', false)

Mobile.verifyElementText(findTestObject('Object Repository/android.widget.TextView - Menu'), 'Menu')

Mobile.tap(findTestObject('android.widget.button - Enviar dinheiro'), 0)

Mobile.verifyElementText(findTestObject('android.widget.TextView - Contactos'), 'Contactos')

Mobile.scrollToText('Sebastião Vaz', FailureHandling.STOP_ON_FAILURE)

Mobile.tap(findTestObject('android.widget.TextView - Sebastião Vaz'), 0)

Mobile.verifyElementText(findTestObject('android.widget.TextView - Enviar dinheiro'), 'Enviar dinheiro')

//Mobile.setText(findTestObject('null'), '50', 2)

Mobile.setText(findTestObject('android.widget.EditText - Description'), 'Almoço', 0)

Mobile.tap(findTestObject('android.widget.Button - Avançar'), 0)

Mobile.verifyElementText(findTestObject('android.widget.TextView - Confirmar transação'), 'Confirmar transação')

Mobile.setEncryptedText(findTestObject('android.widget.EditText - Pin'), 'tzH6RvlfSTg=', 0)

Mobile.tap(findTestObject('android.widget.Button - Confirmar'), 0)

Mobile.verifyElementText(findTestObject('android.widget.TextView - Menu'), 'Menu')

Mobile.verifyElementText(findTestObject('android.widget.TextView - Transação efetuada'), 'Transação efetuada')

