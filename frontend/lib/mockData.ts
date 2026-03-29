export interface Campaign {
	id: string;
	title: string;
	description: string;
	category: string;
	status: "active" | "approved" | "rejected" | "completed";
	fundedAmount: number;
	targetAmount: number;
	donorCount: number;
	startDate: string;
	endDate: string;
	createdBy: string;
	image?: string;
}

export interface Donor {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: "individual" | "organization";
	totalDonated: number;
	donationCount: number;
	joinedDate: string;
	status: "active" | "inactive";
	lastDonationDate: string;
}

export interface Transaction {
	id: string;
	donorId: string;
	donorName: string;
	campaignId: string;
	campaignTitle: string;
	amount: number;
	method: "esewa" | "bank_transfer" | "cash";
	status: "completed" | "pending" | "failed";
	date: string;
	transactionHash?: string;
}

export interface Category {
	id: string;
	name: string;
	icon: string;
	description: string;
	campaignCount: number;
}

export interface GoodRow {
	id: string;
	name: string;
	category: string;
	quantity: number;
	unit: string;
	condition: "new" | "good" | "fair" | "poor";
	location: string;
	donor: string;
	dateReceived: string;
	status: "available" | "distributed" | "damaged";
}

export interface Announcement {
	id: string;
	title: string;
	content: string;
	type: "urgent" | "info" | "warning";
	publishDate: string;
	author: string;
}

export interface AnnouncementRow {
	id: string;
	title: string;
	content: string;
	category: string;
	priority: "high" | "medium" | "low";
	status: "draft" | "published" | "archived";
	views: number;
	createdAt: string;
	publishedAt?: string;
}

export interface CommentRow {
	id: string;
	author: string;
	email: string;
	relatedTo: string;
	relatedType: "campaign" | "post" | "update";
	content: string;
	sentiment: "positive" | "neutral" | "negative";
	status: "pending" | "approved" | "rejected";
	createdAt: string;
}

export interface DonorHall {
	id: string;
	name: string;
	totalDonated: number;
	donationCount: number;
	badge: "gold" | "silver" | "bronze";
}

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
	{
		id: "1",
		title: "Nepal Earthquake Relief 2024",
		description: "Emergency relief efforts for earthquake victims in Nepal",
		category: "earthquake",
		status: "active",
		fundedAmount: 45000,
		targetAmount: 100000,
		donorCount: 234,
		startDate: "2024-01-15",
		endDate: "2024-03-15",
		createdBy: "Admin User",
	},
	{
		id: "2",
		title: "Flood Relief - Eastern Region",
		description: "Providing aid to flood-affected communities",
		category: "flood",
		status: "approved",
		fundedAmount: 82000,
		targetAmount: 120000,
		donorCount: 456,
		startDate: "2024-02-01",
		endDate: "2024-04-01",
		createdBy: "Admin User",
	},
	{
		id: "3",
		title: "Landslide Recovery Program",
		description: "Help rebuild homes destroyed by landslides",
		category: "landslide",
		status: "active",
		fundedAmount: 32000,
		targetAmount: 75000,
		donorCount: 178,
		startDate: "2024-01-20",
		endDate: "2024-05-20",
		createdBy: "Admin User",
	},
	{
		id: "4",
		title: "COVID-19 Healthcare Support",
		description: "Medical supplies and oxygen for affected areas",
		category: "health",
		status: "completed",
		fundedAmount: 95000,
		targetAmount: 95000,
		donorCount: 789,
		startDate: "2023-12-01",
		endDate: "2024-01-15",
		createdBy: "Admin User",
	},
	{
		id: "5",
		title: "Winter Emergency Shelter",
		description: "Shelter and heating for homeless individuals",
		category: "shelter",
		status: "rejected",
		fundedAmount: 12000,
		targetAmount: 50000,
		donorCount: 45,
		startDate: "2024-01-10",
		endDate: "2024-03-10",
		createdBy: "User Account",
	},
];

// Mock donors data
export const mockDonors: Donor[] = [
	{
		id: "donor-1",
		name: "Rajeev Kumar",
		email: "rajeev@example.com",
		phone: "+977-1234567890",
		role: "individual",
		totalDonated: 25000,
		donationCount: 12,
		joinedDate: "2023-06-15",
		status: "active",
		lastDonationDate: "2024-03-10",
	},
	{
		id: "donor-2",
		name: "Setu Foundation",
		email: "contact@setufoundation.org",
		phone: "+977-0987654321",
		role: "organization",
		totalDonated: 150000,
		donationCount: 34,
		joinedDate: "2022-01-01",
		status: "active",
		lastDonationDate: "2024-03-09",
	},
	{
		id: "donor-3",
		name: "Priya Sharma",
		email: "priya@example.com",
		phone: "+977-1111111111",
		role: "individual",
		totalDonated: 8500,
		donationCount: 5,
		joinedDate: "2023-11-20",
		status: "active",
		lastDonationDate: "2024-02-28",
	},
	{
		id: "donor-4",
		name: "Global Relief NGO",
		email: "admin@globalrelief.org",
		phone: "+977-2222222222",
		role: "organization",
		totalDonated: 200000,
		donationCount: 45,
		joinedDate: "2021-05-10",
		status: "active",
		lastDonationDate: "2024-03-08",
	},
	{
		id: "donor-5",
		name: "Amit Patel",
		email: "amit@example.com",
		phone: "+977-3333333333",
		role: "individual",
		totalDonated: 3000,
		donationCount: 2,
		joinedDate: "2024-02-01",
		status: "inactive",
		lastDonationDate: "2024-02-15",
	},
];

// Mock transactions data
export const mockTransactions: Transaction[] = [
	{
		id: "txn-001",
		donorId: "donor-1",
		donorName: "Rajeev Kumar",
		campaignId: "1",
		campaignTitle: "Nepal Earthquake Relief 2024",
		amount: 5000,
		method: "esewa",
		status: "completed",
		date: "2024-03-10",
		transactionHash: "ESEWA123456789",
	},
	{
		id: "txn-002",
		donorId: "donor-2",
		donorName: "Setu Foundation",
		campaignId: "2",
		campaignTitle: "Flood Relief - Eastern Region",
		amount: 50000,
		method: "bank_transfer",
		status: "completed",
		date: "2024-03-09",
		transactionHash: "BANK123456789",
	},
	{
		id: "txn-003",
		donorId: "donor-3",
		donorName: "Priya Sharma",
		campaignId: "1",
		campaignTitle: "Nepal Earthquake Relief 2024",
		amount: 2000,
		method: "esewa",
		status: "completed",
		date: "2024-03-08",
		transactionHash: "ESEWA987654321",
	},
	{
		id: "txn-004",
		donorId: "donor-4",
		donorName: "Global Relief NGO",
		campaignId: "3",
		campaignTitle: "Landslide Recovery Program",
		amount: 75000,
		method: "bank_transfer",
		status: "completed",
		date: "2024-03-07",
		transactionHash: "BANK987654321",
	},
	{
		id: "txn-005",
		donorId: "donor-1",
		donorName: "Rajeev Kumar",
		campaignId: "2",
		campaignTitle: "Flood Relief - Eastern Region",
		amount: 3000,
		method: "esewa",
		status: "pending",
		date: "2024-03-11",
		transactionHash: "ESEWA111111111",
	},
];

// Mock categories
export const mockCategories: Category[] = [
	{
		id: "cat-1",
		name: "Earthquake",
		icon: "🌍",
		description: "Relief efforts for earthquake disasters",
		campaignCount: 8,
	},
	{
		id: "cat-2",
		name: "Flood",
		icon: "💧",
		description: "Aid for flood-affected areas",
		campaignCount: 12,
	},
	{
		id: "cat-3",
		name: "Landslide",
		icon: "🏔️",
		description: "Support for landslide victims",
		campaignCount: 5,
	},
	{
		id: "cat-4",
		name: "Health",
		icon: "🏥",
		description: "Medical and health-related support",
		campaignCount: 15,
	},
	{
		id: "cat-5",
		name: "Shelter",
		icon: "🏠",
		description: "Housing and shelter assistance",
		campaignCount: 7,
	},
];

// Mock relief goods
export const mockGoods: GoodRow[] = [
	{
		id: "good-1",
		name: "Winter Jacket",
		category: "Clothing",
		quantity: 15,
		unit: "pieces",
		condition: "new",
		location: "Warehouse A",
		donor: "John Doe",
		dateReceived: "2026-03-10",
		status: "available",
	},
	{
		id: "good-2",
		name: "Blanket",
		category: "Bedding",
		quantity: 30,
		unit: "pieces",
		condition: "good",
		location: "Warehouse B",
		donor: "Emily Smith",
		dateReceived: "2026-03-12",
		status: "available",
	},
	{
		id: "good-3",
		name: "Rice Pack",
		category: "Food",
		quantity: 50,
		unit: "kg",
		condition: "new",
		location: "Warehouse C",
		donor: "Global Relief Org",
		dateReceived: "2026-03-11",
		status: "distributed",
	},
	{
		id: "good-4",
		name: "School Bag",
		category: "Stationery",
		quantity: 20,
		unit: "pieces",
		condition: "fair",
		location: "Warehouse A",
		donor: "Local Community",
		dateReceived: "2026-03-09",
		status: "available",
	},
	{
		id: "good-5",
		name: "Water Bottle",
		category: "Utensils",
		quantity: 40,
		unit: "pieces",
		condition: "good",
		location: "Warehouse B",
		donor: "Aid Foundation",
		dateReceived: "2026-03-08",
		status: "damaged",
	},
	{
		id: "good-6",
		name: "Canned Food",
		category: "Food",
		quantity: 100,
		unit: "cans",
		condition: "new",
		location: "Warehouse C",
		donor: "International Relief",
		dateReceived: "2026-03-13",
		status: "available",
	},
	{
		id: "good-7",
		name: "Sleeping Mat",
		category: "Bedding",
		quantity: 25,
		unit: "pieces",
		condition: "poor",
		location: "Warehouse A",
		donor: "Community Help",
		dateReceived: "2026-03-07",
		status: "distributed",
	},
];

// Mock announcements
export const mockAnnouncements: AnnouncementRow[] = [
	{
		id: "ann-1",
		title: "Emergency Relief Update",
		content:
			"Updated guidelines for disaster relief distribution. All volunteers must complete the new safety training.",
		category: "urgent",
		priority: "high",
		status: "published",
		views: 1200,
		createdAt: "2024-03-11",
		publishedAt: "2024-03-11",
	},
	{
		id: "ann-2",
		title: "New Campaign Approval Process",
		content:
			"We have streamlined the campaign approval process. Campaigns will now be reviewed within 24 hours.",
		category: "info",
		priority: "medium",
		status: "draft",
		views: 450,
		createdAt: "2024-03-10",
	},
	{
		id: "ann-3",
		title: "System Maintenance Notice",
		content:
			"Scheduled maintenance on March 15th from 2 AM to 4 AM. The system will be unavailable during this time.",
		category: "warning",
		priority: "medium",
		status: "published",
		views: 300,
		createdAt: "2024-03-09",
		publishedAt: "2024-03-09",
	},
	{
		id: "ann-4",
		title: "Community Outreach Program",
		content:
			"Join us this weekend for a community clean-up and tree planting event. Volunteers of all ages are welcome.",
		category: "info",
		priority: "low",
		status: "draft",
		views: 150,
		createdAt: "2024-03-08",
	},
	{
		id: "ann-5",
		title: "Health and Safety Training",
		content:
			"Mandatory health and safety training session scheduled for all staff on March 20th.",
		category: "urgent",
		priority: "high",
		status: "archived",
		views: 800,
		createdAt: "2024-03-07",
		publishedAt: "2024-03-07",
	},
	{
		id: "ann-6",
		title: "New Volunteer Guidelines",
		content:
			"Updated volunteer guidelines have been posted. Please review before participating in upcoming events.",
		category: "info",
		priority: "medium",
		status: "published",
		views: 620,
		createdAt: "2024-03-06",
		publishedAt: "2024-03-06",
	},
];

// Mock comments
export const mockCommentRows: CommentRow[] = [
	{
		id: "cmt-001",
		author: "Rajeev Kumar",
		email: "rajeev.kumar@example.com",
		relatedTo: "1",
		relatedType: "campaign",
		content: "Amazing initiative! Really appreciate the effort.",
		sentiment: "positive",
		status: "approved",
		createdAt: "2024-03-10T09:30:00Z",
	},
	{
		id: "cmt-002",
		author: "Priya Sharma",
		email: "priya.sharma@example.com",
		relatedTo: "2",
		relatedType: "post",
		content: "Looking forward to updates on this.",
		sentiment: "neutral",
		status: "approved",
		createdAt: "2024-03-09T14:20:00Z",
	},
	{
		id: "cmt-003",
		author: "Suresh Thapa",
		email: "suresh.thapa@example.com",
		relatedTo: "1",
		relatedType: "update",
		content: "Why hasn’t this reached my area yet?",
		sentiment: "negative",
		status: "pending",
		createdAt: "2024-03-11T11:15:00Z",
	},
	{
		id: "cmt-004",
		author: "Anita Joshi",
		email: "anita.joshi@example.com",
		relatedTo: "3",
		relatedType: "campaign",
		content: "Keep up the good work!",
		sentiment: "positive",
		status: "approved",
		createdAt: "2024-03-12T08:45:00Z",
	},
	{
		id: "cmt-005",
		author: "Ramesh Koirala",
		email: "ramesh.koirala@example.com",
		relatedTo: "2",
		relatedType: "post",
		content: "I have some suggestions for better organization.",
		sentiment: "neutral",
		status: "pending",
		createdAt: "2024-03-13T16:10:00Z",
	},
	{
		id: "cmt-006",
		author: "Sunita Adhikari",
		email: "sunita.adhikari@example.com",
		relatedTo: "1",
		relatedType: "update",
		content: "Disappointed with the delays.",
		sentiment: "negative",
		status: "rejected",
		createdAt: "2024-03-14T12:00:00Z",
	},
	{
		id: "cmt-007",
		author: "Bikash Thapa",
		email: "bikash.thapa@example.com",
		relatedTo: "3",
		relatedType: "campaign",
		content: "This campaign really helped my community.",
		sentiment: "positive",
		status: "approved",
		createdAt: "2024-03-15T10:25:00Z",
	},
	{
		id: "cmt-008",
		author: "Mina Gurung",
		email: "mina.gurung@example.com",
		relatedTo: "2",
		relatedType: "post",
		content: "Can you share more details about the process?",
		sentiment: "neutral",
		status: "approved",
		createdAt: "2024-03-16T09:40:00Z",
	},
];

// Mock Hall of Fame
export const mockHallOfFame: DonorHall[] = [
	{
		id: "hall-1",
		name: "Global Relief NGO",
		totalDonated: 200000,
		donationCount: 45,
		badge: "gold",
	},
	{
		id: "hall-2",
		name: "Setu Foundation",
		totalDonated: 150000,
		donationCount: 34,
		badge: "gold",
	},
	{
		id: "hall-3",
		name: "Rajeev Kumar",
		totalDonated: 25000,
		donationCount: 12,
		badge: "silver",
	},
	{
		id: "hall-4",
		name: "Priya Sharma",
		totalDonated: 8500,
		donationCount: 5,
		badge: "bronze",
	},
];
