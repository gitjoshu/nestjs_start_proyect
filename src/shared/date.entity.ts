import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class DateAudit extends BaseEntity {
    
    @CreateDateColumn()
    created: Date;
  
    @UpdateDateColumn()
    updated: Date;
  }