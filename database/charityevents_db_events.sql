-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_name` varchar(100) NOT NULL,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `location` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `ticket_price` decimal(10,2) DEFAULT '0.00',
  `goal_amount` decimal(10,2) DEFAULT '0.00',
  `raised_amount` decimal(10,2) DEFAULT '0.00',
  `status` enum('upcoming','past','suspended') DEFAULT 'upcoming',
  `category_id` int DEFAULT NULL,
  `org_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `org_id` (`org_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`org_id`) REFERENCES `charity_organizations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Annual Charity Gala','2025-10-15','19:00:00','Grand Ballroom, Sydney','An elegant evening of dining, dancing, and fundraising for children in need',150.00,50000.00,35000.00,'upcoming',1,1,'https://example.com/gala.jpg'),(2,'5K Charity Fun Run','2025-10-20','08:30:00','Centennial Park, Melbourne','A fun-filled run for all ages to support environmental initiatives',30.00,10000.00,7500.00,'upcoming',2,2,'https://example.com/funrun.jpg'),(3,'Art for a Cause Auction','2025-10-08','14:00:00','Art Gallery, Brisbane','Silent auction featuring works from local artists to support healthcare programs',0.00,20000.00,12000.00,'upcoming',3,3,'https://example.com/auction.jpg'),(4,'Music for Hope Concert','2025-11-02','18:30:00','Concert Hall, Perth','Live music event with top artists to benefit children\'s charities',80.00,30000.00,18000.00,'upcoming',4,1,'https://example.com/concert.jpg'),(5,'Eco Workshop Series','2025-10-10','10:00:00','Community Center, Adelaide','Educational workshops on sustainable living for environmental conservation',0.00,5000.00,3000.00,'upcoming',5,2,'https://example.com/workshop.jpg'),(6,'Charity Golf Tournament','2025-09-25','09:00:00','Golf Club, Sydney','Annual golf event to raise funds for healthcare access',120.00,25000.00,25000.00,'past',1,3,'https://example.com/golf.jpg'),(7,'Winter Warmth Drive','2025-09-15','13:00:00','City Hall, Melbourne','Collection drive for winter clothing for the homeless',0.00,8000.00,8500.00,'past',5,1,'https://example.com/winter.jpg'),(8,'Food Festival for Charity','2025-10-01','11:00:00','Food Court, Brisbane','Tasting event featuring local cuisines to support hunger relief',25.00,15000.00,10000.00,'upcoming',1,2,'https://example.com/foodfest.jpg');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-05 21:02:30
