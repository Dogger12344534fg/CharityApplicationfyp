export default function formatCurrency(value: number) {
		if (!value) return "Rs";

		if (value >= 1_000_000) {
			return `Rs.${(value / 1_000_000).toFixed(1)}M`;
		} else if (value >= 1_000) {
			return `Rs.${(value / 1_000).toFixed(1)}K`;
		} else {
			return `Rs.${value}`;
		}
	};