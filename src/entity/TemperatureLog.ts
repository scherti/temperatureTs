import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';

@Entity()
class TemperatureLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: Date,
    nullable: false,
    comment: 'dateTime of temperature value',
  })
  measurementTime!: Date;

  @Column({
    type: 'numeric',
    nullable: false,
    comment: 'temperature measured',
  })
  temperatureValue!: number;

  @Column({ type: 'text', nullable: true, comment: 'sensor id' })
  sensorId!: string;
}

export default TemperatureLog;
