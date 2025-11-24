<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    image_path = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    feedback = relationship("Feedback", back_populates="analysis", uselist=False)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"))
    is_correct = Column(Boolean)
    corrected_label = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("Analysis", back_populates="feedback")
=======
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    image_path = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    feedback = relationship("Feedback", back_populates="analysis", uselist=False)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"))
    is_correct = Column(Boolean)
    corrected_label = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("Analysis", back_populates="feedback")
>>>>>>> 95fbb696c2bff2b497d717df118dc68761b9836f
