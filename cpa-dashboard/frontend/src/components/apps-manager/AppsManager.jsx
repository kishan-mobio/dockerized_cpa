"use client";

import { useState, useEffect, useCallback } from "react";
import { Typography, Switch, Empty, message, Select, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuickbooksAccounts,
  updateQuickbooksAccountStatus,
  syncQuickbooksAccount,
} from "@/redux/thunks/accounts/quickbooks";
import {
  fetchSageAccounts,
  updateSageAccountStatus,
  syncSageAccount,
} from "@/redux/thunks/accounts/sage";
import {
  fetchNetsuiteAccounts,
  updateNetsuiteAccountStatus,
} from "@/redux/thunks/accounts/netsuiteAccounts";
import { fetchOrganizations } from "@/redux/thunks/masters/organization";
import styles from "./AppsManager.module.css";
import CustomButton from "@/components/common/CustomButton";
import CustomSpinner from "../common/CustomSpinner";
import NewAppsConnections from "./NewAppsConnections";
import { setSelectedOrganization } from "@/redux/slices/masters/organization";
import {
  BUTTON_LINK_TEXT,
  ADMIN_ROLE,
  formatDisplayDate,
  ORGANIZATION_FORM_PLACEHOLDERS,
} from "@/utils/const";

const { Title, Text } = Typography;
const { Option } = Select;

// Helper function to truncate text
const truncateText = (text, maxLength = 15) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const AppsManager = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [syncingAccount, setSyncingAccount] = useState(null);

  const dispatch = useDispatch();
  const {
    quickbooksAccounts,
    loading: quickbooksLoading,
    error: quickbooksError,
  } = useSelector((state) => state.quickbooksAccount || {});
  const {
    sageAccounts,
    loading: sageLoading,
    error: sageError,
  } = useSelector((state) => state.sageAccount || {});
  const {
    netsuiteAccounts = [],
    loading: netsuiteLoading,
    error: netsuiteError,
  } = useSelector((state) => state.netsuiteAccount || {});

  const { organizations = [], selectedOrganization = null } = useSelector(
    (state) => state.organizations || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  // Common function to fetch accounts based on account type
  const fetchAccounts = useCallback(
    (accountType) => {
      let fetchAction;
      switch (accountType) {
        case "quickbooks":
          fetchAction = fetchQuickbooksAccounts;
          break;
        case "sage":
          fetchAction = fetchSageAccounts;
          break;
        case "netsuite":
          fetchAction = fetchNetsuiteAccounts;
          break;
        default:
          fetchAction = null;
      }

      if (fetchAction) {
        if (user?.role === ADMIN_ROLE) {
          if (selectedOrganization) {
            dispatch(fetchAction({ organization_id: selectedOrganization }));
          }
        } else {
          dispatch(fetchAction({ organization_id: user?.organization_id }));
        }
      }
    },
    [dispatch, user?.role, selectedOrganization, user?.organization_id]
  );

  // Common function to handle account status toggle
  const handleAccountToggle = async (checked, id, accountType) => {
    let toggleAction;
    switch (accountType) {
      case "quickbooks":
        toggleAction = updateQuickbooksAccountStatus;
        break;
      case "sage":
        toggleAction = updateSageAccountStatus;
        break;
      case "netsuite":
        toggleAction = updateNetsuiteAccountStatus;
        break;
      default:
        toggleAction = null;
    }

    try {
      const result = await dispatch(
        toggleAction({ id, status: checked })
      ).unwrap();
      message.success(result.message);
      // Refresh the accounts data after successful toggle
      fetchAccounts(accountType);
    } catch (error) {
      message.error(`Failed to update ${accountType} account status`);
    }
  };

  // Common function to handle account sync
  const handleAccountSync = async (id, organization_id, accountType) => {
    const syncAction =
      accountType === "quickbooks" ? syncQuickbooksAccount : syncSageAccount;
    setSyncingAccount(id);
    try {
      const result = await dispatch(
        syncAction({ id, organization_id })
      ).unwrap();
      message.success(result.message);
      fetchAccounts(accountType);
    } catch (error) {
      message.error(`Failed to sync ${accountType} account.`);
    } finally {
      setSyncingAccount(null);
    }
  };

  useEffect(() => {
    // Fetch organizations if user is admin
    if (user?.role === ADMIN_ROLE) {
      dispatch(fetchOrganizations());
    }
  }, [dispatch, user?.role]);

  useEffect(() => {
    // Fetch accounts for all types
    fetchAccounts("quickbooks");
    fetchAccounts("sage");
    fetchAccounts("netsuite");
  }, [fetchAccounts]);

  // Handle organization change
  const handleOrganizationChange = (value) => {
    dispatch(setSelectedOrganization(value));
  };

  const renderAccountCard = (account, type) => {
    const iconSrc =
      type === "quickbooks"
        ? "/icons/quickbooks.png"
        : type === "sage"
        ? "/icons/sage.png"
        : type === "netsuite"
        ? "/icons/netsuite.png"
        : "";

    return (
      <div key={account.id} className={styles.card}>
        <div className={styles.cardMedia}>
          <Image
            src="/icons/candle.png"
            alt="Candle Icon"
            width={20}
            height={20}
            className={styles.candleIcon}
          />
          <Image
            src="/icons/link.png"
            alt="Link Icon"
            width={20}
            height={20}
            className={styles.linkIcon}
          />
          <Image src={iconSrc} alt={`${type} Icon`} width={28} height={24} />
        </div>
        <div className={styles.mainBox}>
          <div className={styles.appDetails}>
            <Tooltip title={account.company_name}>
              <Text className={styles.appName}>
                {truncateText(account.company_name) || type}
              </Text>
            </Tooltip>

            <Text type="secondary" className={styles.updateText}>
              Updated {formatDisplayDate(account.updated_at)}
            </Text>

            <Text type="secondary" className={styles.syncText}>
              Last synced{" "}
              {account.last_synced
                ? formatDisplayDate(account.last_synced)
                : "Not Synced"}
            </Text>
          </div>

          <div className={styles.syncContainer}>
            <Switch
              checked={account.status}
              className={styles.toggleSwitch}
              onChange={(checked) =>
                handleAccountToggle(checked, account.id, type)
              }
            />
            <SyncOutlined
              className={`${styles.syncIcon} ${
                syncingAccount === account.id ? styles.syncing : ""
              } ${!account.status ? styles.disabled : ""}`}
              onClick={() =>
                handleAccountSync(account.id, account.organization_id, type)
              }
              disabled={!account.status}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div>
          <Title level={3} className={styles.title}>
            Integration and Workflows
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            Supercharge your workflow and handle repetitive tasks in the apps
            you use every day.
          </Text>
        </div>
        <div className={styles.headerActions}>
          {user?.role === ADMIN_ROLE && (
            <Select
              placeholder={
                ORGANIZATION_FORM_PLACEHOLDERS.pleaseSelectOrganization
              }
              onChange={handleOrganizationChange}
              value={selectedOrganization}
              className={styles.organizationSelect}
              allowClear
            >
              {organizations?.map((org) => (
                <Option key={org.id} value={org.id}>
                  {org.organizationName || org.name}
                </Option>
              ))}
            </Select>
          )}
          {user?.role !== ADMIN_ROLE && (
            <CustomButton
              type="primary"
              buttonText={BUTTON_LINK_TEXT.addConnections}
              className={styles.customButton}
              onClick={() => setIsDrawerOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Data Handling */}
      {user?.role === ADMIN_ROLE && !selectedOrganization ? (
        <div className={styles.emptyContainer}>
          <Empty description="Please select an organization to view accounts" />
        </div>
      ) : quickbooksLoading || sageLoading || netsuiteLoading ? (
        <CustomSpinner />
      ) : quickbooksError && sageError && netsuiteError ? (
        <div className={styles.emptyContainer}>
          <Empty
            description={
              <div>
                <p>Failed to load accounts.</p>
                <CustomButton
                  type="primary"
                  buttonText="Retry"
                  onClick={() => {
                    fetchAccounts("quickbooks");
                    fetchAccounts("sage");
                    fetchAccounts("netsuite");
                  }}
                />
              </div>
            }
          />
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {[...quickbooksAccounts, ...sageAccounts, ...netsuiteAccounts]
            .length > 0 ? (
            [
              ...quickbooksAccounts.map((acc) => ({
                ...acc,
                type: "quickbooks",
              })),
              ...sageAccounts.map((acc) => ({ ...acc, type: "sage" })),
              ...netsuiteAccounts.map((acc) => ({ ...acc, type: "netsuite" })),
            ].map((account) => renderAccountCard(account, account.type))
          ) : (
            <div className={styles.emptyContainer}>
              <Empty description="No data" />
            </div>
          )}
        </div>
      )}

      {/* NewAppsConnections Drawer */}
      <NewAppsConnections
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAccountCreated={() => {
          fetchAccounts("sage");
          fetchAccounts("quickbooks");
          fetchAccounts("netsuite");
        }}
      />
    </div>
  );
};

export default AppsManager;
