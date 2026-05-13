from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..database import get_db
from ..models import Group
from ..schemas import GroupCreate, GroupResponse, EmployeeResponse

router = APIRouter()


# Get all groups
@router.get("/", response_model=List[GroupResponse])
def get_groups(db: Session = Depends(get_db)):
    return db.query(Group).all()

# Get a single group
@router.get("/{group_id}", response_model=GroupResponse)
def get_group(group_id: UUID, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            define=f"Group with id {group_id} not found"
        )
    return group

# Create group
@router.post("/", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    group_exists = db.query(Group).filter(Group.name == group.name).first()
    if group_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            define=f"Group with name {group.name} already exists"
        )
    db_group = Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

# Delete group
@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def group_delete(group_id: UUID, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            define=f"Group with id {group_id} not found!!"
        )
    db.delete(group)
    db.commit()

# Get all members of the group
@router.get("/{group_id}/members", response_model=List[EmployeeResponse])
def get_group_members(group_id: UUID, db: Session = Depends(get_db)):
    group =db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            define=f"Group with id {group_id} not found"
        )
    return group.members



