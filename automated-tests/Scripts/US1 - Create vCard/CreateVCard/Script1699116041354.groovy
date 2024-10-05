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
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

Mobile.startApplication('Apks/app.apk', true)

Mobile.setText(findTestObject('Object Repository/android.widget.EditText - Phone'), '900000000', 0)

Mobile.delay(1)

Mobile.tap(findTestObject('Object Repository/android.widget.Button - Continuar'), 0)

Mobile.verifyElementText(findTestObject('Object Repository/android.widget.TextView - Aderir ao vCard'), 'Aderir ao vCard')

Mobile.setEncryptedText(findTestObject('android.widget.EditText - Password'), '5Ed5CIkj9UQfaMZXAkDVaQ==', 0)

Mobile.setEncryptedText(findTestObject('android.widget.EditText - Pin'), 'tzH6RvlfSTg=', 0)

Mobile.tap(findTestObject('android.widget.Button - Criar'), 0)

Mobile.verifyElementText(findTestObject('android.widget.TextView - Menu'), 'Menu')

Mobile.closeApplication()

