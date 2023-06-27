-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema F1 Schedule
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema F1 Schedule
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `F1 Schedule` DEFAULT CHARACTER SET utf8 ;
USE `F1 Schedule` ;

-- -----------------------------------------------------
-- Table `F1 Schedule`.`slideshow`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `F1 Schedule`.`slideshow` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NULL,
  `image_source` VARCHAR(45) NOT NULL,
  `priority` INT ZEROFILL NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `F1 Schedule`.`event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `F1 Schedule`.`event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `date` VARCHAR(20) NULL,
  `location` VARCHAR(45) NOT NULL,
  `image_source` VARCHAR(45) NOT NULL,
  `description` VARCHAR(2000) NULL DEFAULT 'Coming Soon...',
  `map_source` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `F1 Schedule`.`nationality`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `F1 Schedule`.`nationality` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nation` VARCHAR(45) NOT NULL,
  `flag_source` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `F1 Schedule`.`team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `F1 Schedule`.`team` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `logo_source` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `F1 Schedule`.`drivers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `F1 Schedule`.`drivers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(70) NOT NULL,
  `nationality_id` INT NOT NULL,
  `team_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nationality_id_UNIQUE` (`nationality_id` ASC) VISIBLE,
  UNIQUE INDEX `team_id_UNIQUE` (`team_id` ASC) VISIBLE,
  CONSTRAINT `nationality`
    FOREIGN KEY (`id`)
    REFERENCES `F1 Schedule`.`nationality` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `team`
    FOREIGN KEY (`id`)
    REFERENCES `F1 Schedule`.`team` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `F1 Schedule`.`points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `F1 Schedule`.`points` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `driver_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `event_id_UNIQUE` (`event_id` ASC) VISIBLE,
  UNIQUE INDEX `driver_id_UNIQUE` (`driver_id` ASC) VISIBLE,
  CONSTRAINT `event`
    FOREIGN KEY (`id`)
    REFERENCES `F1 Schedule`.`event` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `driver`
    FOREIGN KEY (`id`)
    REFERENCES `F1 Schedule`.`drivers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
