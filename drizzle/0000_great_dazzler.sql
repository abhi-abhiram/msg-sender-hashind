CREATE TABLE `hashind-project_customer` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone_no` varchar(20) NOT NULL,
	`dob` date NOT NULL,
	`aniversary` date NOT NULL,
	`created_at` timestamp(6) DEFAULT (now()),
	CONSTRAINT `hashind-project_customer_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_unique` UNIQUE(`email`),
	CONSTRAINT `phone_no_unique` UNIQUE(`phone_no`)
);
--> statement-breakpoint
CREATE TABLE `hashind-project_feedback` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`customer_id` bigint NOT NULL,
	`feedback` json NOT NULL,
	`visitingTime` enum('morning','afternoon','evening_snacks','dinner') NOT NULL,
	`created_at` timestamp(6) DEFAULT (now()),
	CONSTRAINT `hashind-project_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `phone_no_index` ON `hashind-project_customer` (`phone_no`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `hashind-project_customer` (`created_at`);--> statement-breakpoint
CREATE INDEX `customer_id_index` ON `hashind-project_feedback` (`customer_id`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `hashind-project_feedback` (`created_at`);