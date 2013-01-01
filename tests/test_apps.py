from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

import unittest
import os


class TestApp(unittest.TestCase):

    def setUp(self):
        try:
            os.environ['SAUCE_USERNAME']
            desired_capabilities = webdriver.DesiredCapabilities.FIREFOX
            desired_capabilities['version'] = os.environ['SAUCE_BROWSER_VERSION']
            desired_capabilities['platform'] = os.environ['SAUCE_PLATFORM']
            desired_capabilities['name'] = 'Testing Get In The Habit'

            self.driver = webdriver.Remote(
                desired_capabilities=desired_capabilities,
                command_executor="http://%s:%s@ondemand.saucelabs.com:80/wd/hub" % (os.environ['SAUCE_USERNAME'],
                                                                                    os.environ['SAUCE_ACCESS_KEY'])
            )
        except Exception as e:
            print e
            self.driver = webdriver.Firefox()
        self.driver.set_window_size(320, 480)
        self.driver.get("http://localhost:8008")

    def test_that_we_can_open_and_close_panel(self):
        self.driver.find_element(By.ID , 'extraslink').click()
        WebDriverWait(self.driver, 5).until(lambda driver : driver.find_element_by_id("close").is_displayed())
        close_button = self.driver.find_element_by_id('close')
        close_button.click()
        self.assertFalse(close_button.is_displayed())

    def test_that_we_add_new_item_and_check_it_is_still_there_after_a_refresh(self):
        self.driver.find_element(By.ID , 'extraslink').click()
        WebDriverWait(self.driver, 5).until(lambda driver : driver.find_element_by_id("close").is_displayed())
        self.driver.find_element(By.ID, "task").send_keys("eat more cheese")
        self.driver.find_element(By.ID, "addItem").click()

        # Refresh and if still there then we are good!
        self.driver.refresh()
        WebDriverWait(self.driver, 10).until(lambda driver : driver.find_element(By.CSS_SELECTOR, ".task").is_displayed())


    def tearDown(self):
        self.driver.quit()
