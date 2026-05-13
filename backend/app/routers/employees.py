from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..database import get_db
from ..models import Employee, Group
from ..schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router=APIRouter()


# Get all Employees
@router.get("/", response_model=List[EmployeeResponse])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = db.query(Employee).offset(skip).limit(limit).all()
    return employees

# Get employee by ID
@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: UUID, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with {employee_id} is not found!!"
        )
    return employee

# Create employee
@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):

    # check if employee email already exists
    employee_exists = db.query(Employee).filter(Employee.email == employee.email).first()
    if employee_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with the email {employee.email} already exists!!"
        )
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

# Update employee
@router.put("/{employee_id}",response_model=EmployeeResponse)
def update_employee(employee_id: UUID, employee_update: EmployeeUpdate, db: Session = Depends(get_db)):

    # validates the employee_id exists in db
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {employee_id} is not found!!"
        )
    
    # Only update the fields that were sent in the request
    update_data = employee_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setarr(employee, field, value)
    db.commit()
    db.refresh(employee)
    return employee

# Delete Employee
@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: UUID, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {employee_id} not found!!"
        )
    db.delete(employee)
    db.commit()

# Add employee to the group
@router.post("/{employee_id}/groups/{group_id}", response_model=EmployeeResponse)
def add_employee_to_group(employee_id: UUID, group_id: UUID, db:Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {employee_id} not found!!"
        )
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with id {group_id} not found!!"
        )
    
    # check if the employee is already a member
    if group in employee.groups:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee is already a member of this group"
        )
    employee.groups.append(group)
    db.commit()
    db.refresh(employee)
    return employee

# Remove employee from group
@router.delete("/{employee_id}/groups/{group_id}", response_model=EmployeeResponse)
def delete_employee_from_group(employee_id: UUID, group_id: UUID, db:Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            define=f"Employee with id {employee_id} not found!!"
        )
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            define=f"Group with id {group_id} not found!!"
        )
    # check the employee is part of the group
    if group not in employee.groups:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee is not a member of this group"
        )
    employee.groups.remove(group)
    db.commit()
    db.refresh(employee)
    return employee



