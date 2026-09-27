# LandGuard AI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
<!-- Add more badges here -->

## Description

LandGuard AI is a comprehensive geospatial early-warning and landslide risk monitoring system designed for North Eastern India. It features a novel **Two-Stage Hybrid Risk Architecture** enhanced with **Explainable AI (XAI)** to provide transparent, interpretable risk assessments and timely alerts.

## Architecture Overview

The system is built on a modern, robust technology stack:

- **Machine Learning Pipeline (Python):** Handles geospatial data processing, model training, and SHAP-based explainability analysis.
- **Backend (Node.js):** RESTful API providing geospatial queries, alert management, and real-time data integration.
- **Frontend (React):** Interactive web dashboard for visualization, risk monitoring, and field report submission.

## Features

- **Two-Stage Risk Modeling:** Combines regional susceptibility mapping with localized high-risk area analysis.
- **Explainable AI (SHAP):** Provides interpretable predictions by highlighting key features contributing to landslide risk.
- **Interactive Geospatial Dashboard:** Web-based interface for visualizing risk zones, historical data, and active alerts.
- **Real-Time Rainfall Integration:** Incorporates live weather data for dynamic risk updating.
- **Field Report Submission:** Allows users and authorities to submit on-the-ground observations.
- **Alert Engine:** Automated notification system for at-risk areas.

## Quick Start Guide

### ML Pipeline
1. Navigate to the `ml_pipeline` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Follow the instructions in `ml_pipeline/README.md` to train models and run inferences.

### Backend
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Set up your `.env` file based on `.env.example`.
4. Start the server: `npm run dev`

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the application: `npm start`

## Team Members
- Mayukh Paul
- Kousambi Ghosh
- Koustav Ghosh
- Srinjay Konar
- Albin Mathew

**Supervisor:** Prof. Aniruddha Ghosh

## References

1. Paper 1 reference
2. Paper 2 reference
3. Paper 3 reference
4. Paper 4 reference

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
