"use client";

import React, { useState } from "react";
import { Drawer, Select, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NewAppsConnections.module.css";
import CustomButton from "@/components/common/CustomButton";
import {
  BUTTON_LINK_TEXT,
  PAGE_TITLES,
  ADMIN_ROLE,
  MESSAGES,
  USER_FORM_NAME_KEYS,
  USER_LABEL_TEXT,
  USER_FORM_RULES,
  USER_FORM_PLACEHOLDERS,
} from "@/utils/const";
import { createSageAccount } from "@/redux/thunks/accounts/sage";
import { createNetsuiteAccount } from "@/redux/thunks/accounts/netsuiteAccounts";
import { getQuickbooksOAuthUrl } from "@/redux/thunks/accounts/quickbooks";
import Cookies from "js-cookie";

const { Option } = Select;

const NewAppsConnections = ({ open, onClose, onAccountCreated }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role;
  const selectedOrganization = useSelector(
    (state) => state.organizations.selectedOrganization
  );

  // Get organization_id based on user role
  const getOrganizationId = () => {
    if (userRole === ADMIN_ROLE) {
      return selectedOrganization?.id;
    }
    const userData = user || JSON.parse(Cookies.get("user") || "{}");
    return userData?.organization_id;
  };

  /**
   * ✅ Handles the connect button click event
   */
  const handleConnectClick = async (values) => {
    // Store email and company name in local storage
    localStorage.setItem("company_name", values.company_name);
    localStorage.setItem("email", values.email);

    switch (values.application) {
      case "QuickBooks":
        try {
          // Get OAuth URL from backend
          const result = await dispatch(getQuickbooksOAuthUrl()).unwrap();
          const oauthUrl = result.data?.oauth_url || result.oauth_url;

          if (oauthUrl) {
            window.location.href = oauthUrl;
          } else {
            message.error("Failed to get QuickBooks OAuth URL");
          }
        } catch (error) {
          message.error("Failed to get QuickBooks OAuth URL");
        }
        break;
      case "Sage":
        try {
          const organizationId = getOrganizationId();

          if (!organizationId) {
            message.error(MESSAGES.SAGE_ORGANIZATION_ERROR);
            return;
          }

          const sageAccountData = {
            sageUserID: values.sageUserID,
            sageUserPassword: values.sageUserPassword,
            sageSenderID: values.sageSenderID,
            sageSenderPassword: values.sageSenderPassword,
            sageCompanyID: values.sageCompanyID,
            email: values.email,
            company_name: values.company_name,
            organization_id: organizationId,
          };

          await dispatch(createSageAccount(sageAccountData)).unwrap();
          message.success(MESSAGES.SAGE_CONNECT_SUCCESS);
          onAccountCreated?.(); // Call the callback after successful account creation
          handleClose();
        } catch (error) {
          message.error(error.message || MESSAGES.SAGE_CONNECT_ERROR);
        }
        break;
      case "Netsuite":
        try {
          const organizationId = getOrganizationId();
          if (!organizationId) {
            message.error(
              MESSAGES.NETSUITE_ORGANIZATION_ERROR ||
                "Organization ID is required."
            );
            return;
          }
          const netsuiteAccountData = {
            email: values.email,
            company_name: values.company_name,
            organization_id: organizationId,
          };
          await dispatch(createNetsuiteAccount(netsuiteAccountData)).unwrap();
          message.success(
            MESSAGES.NETSUITE_CONNECT_SUCCESS ||
              "Netsuite connected successfully!"
          );
          onAccountCreated?.();
          handleClose();
        } catch (error) {
          message.error(
            error.message ||
              MESSAGES.NETSUITE_CONNECT_ERROR ||
              "Failed to connect Netsuite."
          );
        }
        break;
      default:
        break;
    }
  };

  /**
   * ✅ Handles the drawer close event
   */
  const handleClose = () => {
    form.resetFields();
    setSelectedApp(null);
    onClose();
  };

  return (
    <Drawer
      title={PAGE_TITLES.addNewConnection}
      placement="right"
      width={500}
      onClose={handleClose}
      open={open}
      className={styles.drawer}
    >
      <Form form={form} layout="vertical" onFinish={handleConnectClick}>
        {/* Dropdown to select application */}
        <Form.Item
          label="Select Application"
          name="application"
          rules={[{ required: true, message: "Please select an application!" }]}
        >
          <Select
            placeholder="Select an application"
            onChange={(value) => setSelectedApp(value)}
          >
            <Option value="QuickBooks">QuickBooks</Option>
            <Option value="Sage">Sage</Option>
            <Option value="Netsuite">Netsuite</Option>
          </Select>
        </Form.Item>

        {/* Company Name Field */}
        <Form.Item
          label={USER_LABEL_TEXT.company_name}
          name={USER_FORM_NAME_KEYS.company_name}
          rules={USER_FORM_RULES.company_name}
        >
          <Input placeholder={USER_FORM_PLACEHOLDERS.company_name} />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label={USER_LABEL_TEXT.email}
          name={USER_FORM_NAME_KEYS.email}
          rules={USER_FORM_RULES.email}
        >
          <Input placeholder={USER_FORM_PLACEHOLDERS.email} />
        </Form.Item>

        {/* Sage-specific fields */}
        {selectedApp === "Sage" && (
          <>
            <Form.Item
              label={USER_LABEL_TEXT.sageUserID}
              name={USER_FORM_NAME_KEYS.sageUserID}
              rules={USER_FORM_RULES.sageUserID}
            >
              <Input placeholder={USER_FORM_PLACEHOLDERS.sageUserID} />
            </Form.Item>

            <Form.Item
              label={USER_LABEL_TEXT.sageUserPassword}
              name={USER_FORM_NAME_KEYS.sageUserPassword}
              rules={USER_FORM_RULES.sageUserPassword}
            >
              <Input.Password
                placeholder={USER_FORM_PLACEHOLDERS.sageUserPassword}
              />
            </Form.Item>

            <Form.Item
              label={USER_LABEL_TEXT.sageSenderID}
              name={USER_FORM_NAME_KEYS.sageSenderID}
              rules={USER_FORM_RULES.sageSenderID}
            >
              <Input placeholder={USER_FORM_PLACEHOLDERS.sageSenderID} />
            </Form.Item>

            <Form.Item
              label={USER_LABEL_TEXT.sageSenderPassword}
              name={USER_FORM_NAME_KEYS.sageSenderPassword}
              rules={USER_FORM_RULES.sageSenderPassword}
            >
              <Input.Password
                placeholder={USER_FORM_PLACEHOLDERS.sageSenderPassword}
              />
            </Form.Item>

            <Form.Item
              label={USER_LABEL_TEXT.sageCompanyID}
              name={USER_FORM_NAME_KEYS.sageCompanyID}
              rules={USER_FORM_RULES.sageCompanyID}
            >
              <Input placeholder={USER_FORM_PLACEHOLDERS.sageCompanyID} />
            </Form.Item>
          </>
        )}

        {/* Netsuite-specific fields (none required, just company_name, email, organization_id) */}
        {selectedApp === "Netsuite" && (
          <>
            {/* No extra fields required for Netsuite, just show info if needed */}
          </>
        )}

        {/* Connect Button */}
        <Form.Item>
          <CustomButton
            type="primary"
            buttonText={BUTTON_LINK_TEXT.newConnect}
            iconPosition="left"
            className={styles.connectButton}
            htmlType="submit"
            disabled={!selectedApp}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default NewAppsConnections;
