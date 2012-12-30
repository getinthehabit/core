from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

import unittest
import os


class TestApp(unittest.TestCase):

    def setUp(self):
        try:
            print os.environ
            os.environ['SAUCE_USERNAME']
            desired_capabilities = webdriver.DesiredCapabilities.FIREFOX
            #desired_capabilities['platform'] = 'Mac 10.8'
            #desired_capabilities['version'] = '6'
            desired_capabilities['version'] = '17'
            desired_capabilities['platform'] = 'Windows 2003'
            desired_capabilities['name'] = 'Testing Get In The Habit'
            print "about to do remote"
            self.driver = webdriver.Remote(
                desired_capabilities=desired_capabilities,
                command_executor="http://%s:%s@ondemand.saucelabs.com:80/wd/hub" % (os.environ['SAUCE_USERNAME'],
                                                                                    os.environ['SAUCE_ACCESS_KEY'])
            )
        except:
            self.driver = webdriver.Firefox()
        self.driver.set_window_size(320, 480)
        self.driver.get("http://localhost:8008")

    def test_that_we_can_open_and_close_panel(self):
        self.driver.find_element(By.ID , 'extraslink').click()
        WebDriverWait(self.driver, 5).until(lambda driver : driver.find_element_by_id("close").is_displayed())
        close_button = self.driver.find_element_by_id('close')
        close_button.click()

    def tearDown(self):
        self.driver.quit()

