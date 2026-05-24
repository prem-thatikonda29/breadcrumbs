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
 * TC-SE-01: Landing page renders correctly and navigates to sign-in.
 *
 * What Safari does (visible to the examiner):
 *   1. Opens the landing page — hero, headline, app mockup all visible
 *   2. Slowly scrolls through the "How it works" and Features sections
 *   3. Scrolls back to the top
 *   4. Clicks "Sign in" in the nav bar
 *   5. Verifies the sign-in page heading, subtitle, and Google button
 *   6. Hovers over the Google button (hover state animates)
 */
@DisplayName("TC-SE-01: Landing Page Navigation & Sign-In Page UI")
public class SignInPageTest {

    private static final String BASE_URL = "https://breadcrumbs-rose.vercel.app";

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.setBinary("/Applications/Brave Browser.app/Contents/MacOS/Brave Browser");
        // Use the real Brave profile so Google sees an existing session
        // NOTE: close Brave completely before running mvn test
        options.addArguments("--user-data-dir=/Users/premthatikonda/Library/Application Support/BraveSoftware/Brave-Browser");
        options.addArguments("--profile-directory=Profile 1");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        js   = (JavascriptExecutor) driver;
    }

    @AfterEach
    void tearDown() {
        if (driver != null) driver.quit();
    }

    @Test
    @DisplayName("Landing page loads with hero headline")
    void testLandingPageHeroLoads() {
        log("Opening landing page...");
        driver.get(BASE_URL + "/");

        WebElement hero = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.tagName("h1"))
        );
        pause(1000);

        log("Verifying hero headline...");
        assertTrue(hero.getText().contains("trail"),
            "Landing page h1 should contain the hero headline");

        log("Scrolling through the page...");
        smoothScrollTo(600);  pause(900);
        smoothScrollTo(1300); pause(900);
        smoothScrollTo(2200); pause(900);
        smoothScrollTo(3000); pause(900);

        log("Scrolling back to top...");
        smoothScrollTo(0);    pause(800);

        log("TC-SE-01a PASSED: Landing page rendered correctly.");
    }

    @Test
    @DisplayName("Clicking Sign in navigates to the sign-in page with correct UI")
    void testSignInNavigation() {
        log("Opening landing page...");
        driver.get(BASE_URL + "/");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
        pause(1000);

        log("Clicking 'Sign in' in the navigation bar...");
        WebElement signInLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.partialLinkText("Sign in"))
        );
        new Actions(driver).moveToElement(signInLink).perform();
        pause(600);
        signInLink.click();

        log("Waiting for sign-in page...");
        wait.until(ExpectedConditions.urlContains("/sign-in"));
        pause(800);

        log("Verifying heading...");
        WebElement heading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.tagName("h1"))
        );
        assertEquals("Breadcrumbs", heading.getText(),
            "Sign-in page h1 should be 'Breadcrumbs'");

        log("Verifying subtitle...");
        WebElement subtitle = driver.findElement(
            By.xpath("//p[contains(text(), 'Track what you explore')]")
        );
        assertTrue(subtitle.isDisplayed(), "Subtitle should be visible");
        pause(600);

        log("Hovering over the Google sign-in button...");
        WebElement button = wait.until(
            ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(normalize-space(), 'Sign in with Google')]")
            )
        );
        new Actions(driver).moveToElement(button).perform();
        pause(1000);

        assertTrue(button.isDisplayed(), "Google button must be visible");
        assertTrue(button.isEnabled(),   "Google button must be enabled");

        log("TC-SE-01b PASSED: Sign-in page rendered with correct heading, subtitle, and button.");
    }

    // ── helpers ──────────────────────────────────────────────────────────────────

    private void smoothScrollTo(int y) {
        js.executeScript("window.scrollTo({ top: " + y + ", behavior: 'smooth' })");
    }

    private void pause(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    private void log(String msg) {
        System.out.println("[TC-SE-01] " + msg);
    }
}
