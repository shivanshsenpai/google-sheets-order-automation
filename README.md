# 📦 Google Sheets Order Automation System

A powerful **order tracking and customer communication automation system** built entirely using **Google Sheets + Apps Script**.

This system connects your **main order database** with your **sales/operations sheet**, eliminating repetitive manual work like checking tracking status, creating links, and messaging customers.

---

# 🚀 Overview

This solution automates the entire post-order workflow:

- 🔍 Tracking status lookup  
- 🔗 Smart tracking link generation (with courier detection)  
- 💬 WhatsApp message automation  
- 💰 COD confirmation messaging  
- 🔁 Return (RTO) handling  
- ⭐ Feedback collection system  
- 📞 Call tracking with locking mechanism  

---

# ⚙️ Key Features

## 1. 📍 Tracking Automation
- Employees enter a **Tracking Code**
- Script automatically:
  - Finds matching order in `MainData`
  - Fetches latest **status**
  - Generates **tracking link**

Example: https://t.17track.net/en#nums=TRACKING_CODE


---

## 2. 🚚 Courier Detection (Smart FC Code)

Tracking links are enhanced using courier-specific codes:

Example:https://t.17track.net/en#nums=17700780926&fc=100055


Courier codes are maintained in a separate sheet:

| Courier Name | FC Code |
|-------------|--------|
| bluedart | 100055 |
| shiprocket | 100662 |

✔ Easy to update  
✔ No code changes required  

---

## 3. 💬 WhatsApp Automation

Clickable WhatsApp links are automatically generated for different scenarios:

### 📦 Order in Transit
Includes:
- Customer name
- Delivery estimate
- Tracking code & link
- Friendly message

---

### 💰 COD Confirmation
Triggered only when:
- Payment Method = COD  
- Order Status = Delivered  

---

### 🔁 Return (RTO) Message
Triggered when:
- Order status indicates return  

---

### ⭐ Feedback Request
Triggered when:
- Order is Delivered  

Includes:
- Google review link  
- IndiaMART review link  
- Contact details  

---

## 4. ⏱️ Smart Delivery Estimate

Based on **country from main data**:

| Condition | Message |
|----------|--------|
| India | Usual delivery time is 3–5 days |
| International | 15–20 days |
| Missing | "Delivery timeline will be shared soon" |

---

## 5. 📞 Call Tracking System

Column: **Call Request**

Default behavior:
- Automatically set to: `Pending`

Allowed values:
- Pending  
- Completed  
- Unreachable  

🔒 Once marked **Completed → Locked permanently**

---

## 6. 💬 Message Tracking System

Column: **Tracking Msg**

Default:
- Pending  

Behavior:
- Once changed to **Sent → Locked permanently**
- Prevents duplicate communication  

---

# 📊 Sheet Structure

## 🟦 1. Incentive_report (Sales Sheet)

Main working sheet used by employees.

Important columns:
- Tracking code
- TrackingLink
- Order Status
- WhatsApp Link
- COD Message
- RTO Message
- FeedbackMsg
- Call Request

---

## 🟩 2. MainData (Source Sheet)

Contains full order database:

- Tracking Code (Column AA)
- Status
- Courier Name
- Country
- Phone Number

---

## 🟨 3. CourierCodes

Used for courier → FC code mapping:

| Courier Name | FC Code |
|-------------|--------|
| bluedart | 100055 |
| dhl | 100003 |
| shiprocket | 100662 |

---

# 🔄 How It Works

1. Employee enters **Tracking Code**
2. Script:
   - Searches in `MainData`
   - Fetches status, courier, country
3. Automatically updates:
   - Tracking link
   - Order status
   - WhatsApp links
   - Delivery estimates
4. Enables:
   - COD messaging
   - RTO messaging
   - Feedback messaging

---

# ▶️ Setup Guide

## Step 1: Open Apps Script
Inside your Google Sheet:
