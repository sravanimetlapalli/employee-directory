# this script is essential and it defines the shape of the data going in and out of your API using pydantic. This is different from models because what the db stores and what it exposes through API is never be the same.

# this script talks with APIs

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID


# group schema
class GroupBase(BaseModel):
    name: str = Field(..., example="Developers" )
    description : Optional[str] = Field(None, example="Developers Team")

class GroupCreate(GroupBase):
    pass

class GroupResponse(GroupBase):
    id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}

# employee schema

class EmployeeBase(BaseModel):
    first_name: str = Field(..., example="John")
    last_name: str = Field(..., example="Doe")
    email: EmailStr = Field(..., example="John.Doe@gmail.com")
    department: str = Field(..., example="Operations")
    role: str = Field(..., example="Infrastructure Engineer")
    phone: Optional[str] = Field(None, example="9999999999")

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = Field(None,  example="John")
    last_name: Optional[str] = Field(None, example="Doe")
    email: Optional[EmailStr] = Field(None, example="John.Doe@gmail.com")
    department: Optional[str] = Field(None, example="Operations")
    role: Optional[str] = Field(None, example="Infra Engineer")
    phone: Optional[str] = Field(None, example="9999999999")

class EmployeeResponse(EmployeeBase):
    id: UUID
    created_at: datetime
    groups: List[GroupResponse] = []

    model_config = {"from_attributes": True}



