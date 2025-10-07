"use client";

import { useState } from "react";
import { Mail, Shield, Globe, Server, Bell } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import SettingsForm from "@/components/common/SettingsForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONFIGURATION_CONSTANTS } from "@/utils/constants/configuration";
import {
  emailFields,
  generalFields,
  notificationFields,
  securityFields,
  stats,
  systemFields,
} from "@/utils/data/configuration";

export default function ConfigurationPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "CPA Pro Dashboard",
    siteDescription: "Professional CPA Management System",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "en",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@cpapro.com",
    fromName: "CPA Pro",
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    passwordMinLength: "8",
    requireTwoFactor: false,
    allowPasswordReset: true,
    maxLoginAttempts: "5",
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    logLevel: "info",
    backupFrequency: "daily",
    maxFileSize: "10",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: "immediate",
  });

  const handleSave = (section, values) => {
    console.log(`Saving ${section} settings:`, values);

    switch (section) {
      case "general":
        setGeneralSettings(values);
        break;
      case "email":
        setEmailSettings(values);
        break;
      case "security":
        setSecuritySettings(values);
        break;
      case "system":
        setSystemSettings(values);
        break;
      case "notifications":
        setNotificationSettings(values);
        break;
    }
  };

  const settingsContent = (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="general">
          <AccordionTrigger>
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-3 text-blue-600" />
              <span className="font-medium">General Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SettingsForm
              fields={generalFields}
              initialValues={generalSettings}
              onSubmit={(values) => handleSave("general", values)}
              submitLabel="Save General Settings"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="email">
          <AccordionTrigger>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-green-600" />
              <span className="font-medium">Email Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SettingsForm
              fields={emailFields}
              initialValues={emailSettings}
              onSubmit={(values) => handleSave("email", values)}
              submitLabel="Save Email Settings"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-3 text-purple-600" />
              <span className="font-medium">Security Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SettingsForm
              fields={securityFields}
              initialValues={securitySettings}
              onSubmit={(values) => handleSave("security", values)}
              submitLabel="Save Security Settings"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="system">
          <AccordionTrigger>
            <div className="flex items-center">
              <Server className="h-5 w-5 mr-3 text-orange-600" />
              <span className="font-medium">System Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SettingsForm
              fields={systemFields}
              initialValues={systemSettings}
              onSubmit={(values) => handleSave("system", values)}
              submitLabel="Save System Settings"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notifications">
          <AccordionTrigger>
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3 text-yellow-600" />
              <span className="font-medium">Notification Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SettingsForm
              fields={notificationFields}
              initialValues={notificationSettings}
              onSubmit={(values) => handleSave("notifications", values)}
              submitLabel="Save Notification Settings"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <PageWrapper
      title={CONFIGURATION_CONSTANTS.PAGE_TITLE}
      subtitle={CONFIGURATION_CONSTANTS.PAGE_SUBTITLE}
      stats={stats}
      showAddButton={false}
      showSearch={false}
      showFilters={false}
      data={[]}
      columns={[]}
      customContent={settingsContent}
    />
  );
}
