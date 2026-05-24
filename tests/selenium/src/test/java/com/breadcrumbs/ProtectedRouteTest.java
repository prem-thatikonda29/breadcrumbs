package com.breadcrumbs;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TC-SE-02: Email/password sign-in flow — from sign-in page to the app dashboard.
 *
 * What Brave does (visible to the examiner):
 *   1. Opens /sign-in
 *   2. Types email and password into the form
 *   3. Submits — Convex Password provider authenticates
 *   4. Asserts the Library dashboard loaded (heading + search bar visible)
 */
@DisplayName("TC-SE-02: Full Google OAuth Sign-In Flow")
public class ProtectedRouteTest {

    private static final String BASE_URL = "https://breadcrumbs-rose.vercel.app";

    private WebDriver driver;
    private WebDriverWait wait;
    private WebDriverWait longWait; // OAuth redirects can be slow

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.setBinary("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser");
        // Use the real Brave profile so Google sees an existing session
        // NOTE: close Brave completely before running mvn test
        options.addArguments("--user-data-dir=/Users/premthatikonda/Library/Application Support/BraveSoftware/Brave-Browser");
        options.addArguments("--profile-directory=Profile 1");
        driver   = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait     = new WebDriverWait(driver, Duration.ofSeconds(15));
        longWait = new WebDriverWait(driver, Duration.ofSeconds(30));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) driver.quit();
    }

    @Test
    @DisplayName("Google OAuth flow signs in and lands on the Library dashboard")
    void testGoogleSignInReachesApp() {
        log("Opening sign-in page...");
        driver.get(BASE_URL + "/sign-in");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
        pause(1000);

        log("Typing email...");
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@type='email']"))
        );
        emailInput.click();
        pause(400);
        emailInput.sendKeys("373premthatikonda@gmail.com");
        pause(600);

        log("Typing password...");
        WebElement passwordInput = driver.findElement(By.xpath("//input[@type='password']"));
        passwordInput.click();
        pause(400);
        passwordInput.sendKeys("373prem0");
        pause(600);

        log("Submitting form...");
        WebElement submitBtn = driver.findElement(
            By.xpath("//button[@type='submit']")
        );
        new Actions(driver).moveToElement(submitBtn).perform();
        pause(400);
        submitBtn.click();

        log("Waiting for redirect back to Breadcrumbs...");
        longWait.until(d -> d.getCurrentUrl().contains(BASE_URL));
        pause(1000);

        log("Waiting for the Library dashboard to load...");
        longWait.until(d ->
            d.getCurrentUrl().contains("/app") ||
            isElementPresent(By.xpath("//*[contains(text(), 'Library')]"))
        );
        pause(1000);

        log("Verifying Library heading is visible...");
        WebElement libraryHeading = longWait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(), 'Library')]")
            )
        );
        assertTrue(libraryHeading.isDisplayed(),
            "Library heading should be visible after sign-in");

        log("Verifying search input is present...");
        WebElement searchInput = driver.findElement(
            By.xpath("//input[@placeholder='Search entries...']")
        );
        assertTrue(searchInput.isDisplayed(), "Search input should be visible on dashboard");
        pause(800);

        log("TC-SE-02 PASSED: Google OAuth sign-in succeeded and Library dashboard loaded.");
    }

    private boolean isElementPresent(By locator) {
        try {
            driver.findElement(locator);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private void pause(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    private void log(String msg) {
        System.out.println("[TC-SE-02] " + msg);
    }
}
