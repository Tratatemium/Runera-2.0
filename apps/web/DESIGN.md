# Runera App Design

## Overview

Runera is a web application for tracking and managing running activities. It enables users to quickly log runs, monitor progress, and review performance data over time.

The design prioritizes:

* **Fast run logging**
* **Clear statistics**
* **Mobile-first usability**
* **Minimal visual clutter**
* **Motivating progress tracking**

---

# Design Principles

1. **Speed First**

   * Logging a run should take less than 10 seconds.

2. **Data Clarity**

   * Important metrics like distance and pace should be immediately visible.

3. **Consistency**

   * UI components behave the same across all pages.

4. **Mobile Priority**

   * Most users will interact with the app on mobile devices.

5. **Motivation Through Progress**

   * Statistics and milestones encourage continued running.

---

# User Flows

## New User

Home → Sign Up → Dashboard → Add First Run → Runs List → Run Details

## Returning User

Home → Login → Dashboard → Runs List → Run Details

## Quick Run Logging

Dashboard → Quick Add Run → Save → Dashboard Update

---

# Color System

## Palette

| Color         | Hex       | Usage                |
| ------------- | --------- | -------------------- |
| Ink Black     | `#0c1618` | Primary text         |
| Pine Teal     | `#004643` | Primary UI color     |
| Cornsilk      | `#faf4d3` | Background           |
| Metallic Gold | `#d1ac00` | Highlights and stats |
| Peach Glow    | `#f6be9a` | Secondary accents    |

## Semantic Colors

Success: `#2e7d32`
Error: `#c62828`
Warning: `#ed6c02`

## Usage Rules

Primary Buttons → Pine Teal
Cards → Cornsilk background
Stats Highlights → Metallic Gold
Text → Ink Black

---

# Typography

## Font Style

Headings

* Modern sans-serif
* Bold
* High contrast

Body Text

* Clean sans-serif
* Highly readable

## Hierarchy

H1 – Page title
H2 – Section title
H3 – Card titles

Body – Standard content
Caption – Metadata (date, weather)

---

# Spacing System

Spacing scale:

4px
8px
16px
24px
32px
48px

## Layout Container

Max width: `1200px`
Standard page padding: `24px`

---

# Core Pages

---

# Home Page

## Purpose

Introduce the app and encourage users to sign up.

## Layout

Hero Section

* App title
* Short description
* Signup and login buttons

Features Section

* Track runs
* View statistics
* Monitor progress

Illustrations or running visuals.

## Color Usage

Background: Cornsilk
Primary CTA: Pine Teal
Highlights: Metallic Gold

---

# Authentication (Signup / Login)

## Features

Simple form layout with:

Email
Password
Confirm password (signup)

## UX Requirements

* Real-time validation
* Clear error messages
* Password visibility toggle

## Layout

Centered card layout.

Background: Pine Teal
Form card: Cornsilk

---

# Dashboard

The main landing page after login.

## Layout

Header

* User avatar
* Name
* Settings link

Statistics Section

Cards showing:

Total Distance
Total Runs
Weekly Distance
Average Pace

Recent Runs Section

Shows last 3–5 runs.

Quick Add Run button visible.

---

# Runs List

Displays all recorded running activities.

## Run Card Layout

Distance (primary metric)

Below it:

Date
Duration
Average pace
Weather icon

Example:

10 km
52:14 • 5:13/km
12 Mar 2026 ☀️

## Features

Search runs
Sort by:

* Newest
* Longest distance
* Fastest pace

Filters:

* Week
* Month
* Year

---

# Add / Edit Run

Form for creating or updating runs.

## Required Fields

Distance
Duration
Date

## Optional Fields

Route map
Notes
Weather
Effort level
Pace (auto calculated)

## UX Rules

Distance and duration automatically calculate pace.

Save button should always be visible.

---

# Run Details

Detailed view of a specific run.

## Layout

Summary Card

Distance
Time
Pace
Date

Map Section

Displays route if available.

Splits Section

Per kilometer or mile pace breakdown.

Notes Section

Runner comments.

Edit and Delete buttons.

---

# UI Components

## Navbar

Persistent navigation.

Elements:

Logo
Dashboard
Runs
Profile

Mobile version collapses to hamburger menu.

---

## Cards

Used for:

Run summaries
Statistics
Profile info

Card Style

Rounded corners
Subtle shadow
Cornsilk background

---

## Buttons

### Primary

Background: Pine Teal
Text: Cornsilk

### Secondary

Border: Pine Teal
Text: Pine Teal

### Danger

Background: Error red

---

## Button States

Default
Hover
Active
Disabled
Loading

---

# Floating Action Button

Quick Add Run button.

Position: bottom-right on mobile.

Icon: +

Color: Pine Teal

Purpose: fast run logging.

---

# Empty States

## No Runs

Message:

"No runs recorded yet."

Button:

Add your first run.

## No Statistics

Message:

"Run a few times to start seeing progress."

---

# Accessibility

The app must support:

Keyboard navigation
Screen readers via ARIA labels
Accessible form validation

Minimum color contrast ratio: 4.5:1

---

# Responsive Design

## Mobile First

Primary layout built for small screens.

### Mobile

Single column layout
Large tap targets
Floating Add Run button

### Tablet

Two-column dashboard

### Desktop

Grid-based layout

Stats grid example:

2 × 2 stat cards

---

# Microinteractions

Run saved → success message
Stats update → subtle animation
Buttons → press feedback
Loading → skeleton loaders

---

# Future Features

Planned improvements:

Weekly distance goals
Run streak tracking
Achievements and milestones
Shoe usage tracking
Route history
GPX export/import

---

# Summary

Runera focuses on three core experiences:

1. **Logging runs quickly**
2. **Viewing progress clearly**
3. **Reviewing past performance**

All design decisions should reinforce these goals.


https://deep-amber-47183484.figma.site