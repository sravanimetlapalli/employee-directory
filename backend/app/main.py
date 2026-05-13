from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import employees, groups

# creating db tables if they don't exist, safety option on top of the alembic migrations
Base.metadata.create_all(bind=engine)

# Create FastAPI instance
app = FastAPI(
    title = "Employee Directory API",
    description = "API for managing employee and their group memberships",
    version = "1.0.0"
)

# CORS Middleware - allows frontend to talk to this API, without this our frontend will be blocked by the api hence we are whitelisting the localhost values.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000" #React Dev Server
        "http://localhost:80" #React in Docker
        "http://frontend",
        "http://frontend-service" #Kubernetes service name
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(
    employees.router,
    prefix="/employees",
    tags=["employees"]
)

app.include_router(
    groups.router,
    prefix="/groups",
    tags=["groups"]
)

# Health checkendpoint where kubernetes liveness probe and readiness probes will use to check the health of the pods, if it is not healthy kubernetes will restart the pod.
@app.get("/health",tags=["health"])
def health_check():
    return {
        "status": "Healthy",
        "service": "employee-directory-api"
    }

# Root endpoint 
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Employee Directory API",
        "docs": "/docs", # this will be the documentation page
        "health": "/health"
    }

