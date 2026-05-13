# this file defines the actual database tables as python classes. This script talks to postgres db

from sqlalchemy import DateTime, Table, Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base # importing base function from database.py file
import uuid

# joins employees table and groups table
employee_groups = Table(
    "employee_groups",
    Base.metadata,
    Column("employee_id", UUID(as_uuid=True), ForeignKey("employees.id"),primary_key=True),
    Column("group_id", UUID(as_uuid=True), ForeignKey("groups.id"),primary_key=True),
    Column("joined_at",DateTime(timezone=True),server_default=func.now())
)

# maps to the employees table and the groups relationship let's you do employee.groups and get all groups back automatically
class Employee(Base):
    __tablename__ = "employees"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(50), nullable=False)
    last_name  = Column(String(50), nullable=False)
    email      = Column(String(100), unique=True, nullable=False, index=True) #index=True creates a database index for fast lookups, highly crucial for search performance
    department = Column(String(100), nullable=False)
    role       = Column(String(100), nullable=False)
    phone      = Column(String(15), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # this relationship will provide all the groups that the employee part of
    groups = relationship(
        "Group",
        secondary=employee_groups,
        back_populates="members"
    )

# maps to the groups table and members relationship let's you do group.members and get all the employee details
class Group(Base):
    __tablename__ = "groups"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # this relationship will provide all the employees that are part of this group
    members = relationship(
        "Employee",
        secondary=employee_groups,
        back_populates="groups"
    )


