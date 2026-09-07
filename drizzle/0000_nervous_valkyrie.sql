CREATE TABLE `usage_sessions` (
	`owner_id` text NOT NULL,
	`session_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`ended_at` integer,
	`open_ms` integer DEFAULT 0 NOT NULL,
	`visible_ms` integer DEFAULT 0 NOT NULL,
	`daily_json` text DEFAULT '{}' NOT NULL,
	`daily_visible_json` text DEFAULT '{}' NOT NULL,
	`pages_json` text DEFAULT '{}' NOT NULL,
	PRIMARY KEY(`owner_id`, `session_id`)
);
