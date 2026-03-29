"use client";

import { useEffect, useRef, useState } from "react";
import {
	MapPin,
	Loader2,
	Navigation,
	Maximize2,
	Minimize2,
	X,
} from "lucide-react";

export interface MapSelectResult {
	lat: number;
	lng: number;
	name: string;
}

interface MapPickerProps {
	onSelect: (data: MapSelectResult) => void;
	selectedLat?: number;
	selectedLng?: number;
}

export function MapPicker({
	onSelect,
	selectedLat,
	selectedLng,
}: MapPickerProps) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const expandedMapRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const expandedMapObjRef = useRef<any>(null);
	const markerRef = useRef<any>(null);
	const expandedMarkerRef = useRef<any>(null);
	const [locating, setLocating] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [leafletLib, setLeafletLib] = useState<any>(null);

	// ── Inject Leaflet CSS once ──────────────────────────────────
	useEffect(() => {
		if (!document.getElementById("leaflet-css")) {
			const link = document.createElement("link");
			link.id = "leaflet-css";
			link.rel = "stylesheet";
			link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
			document.head.appendChild(link);
		}
	}, []);

	// ── Reverse geocode helper ───────────────────────────────────
	const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
			);
			const data = await res.json();
			const addr = data.address ?? {};
			return (
				addr.city ||
				addr.town ||
				addr.village ||
				addr.municipality ||
				addr.county ||
				addr.state_district ||
				addr.state ||
				data.display_name?.split(",")[0] ||
				`${lat.toFixed(4)}, ${lng.toFixed(4)}`
			);
		} catch {
			return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
		}
	};

	// ── Init small map ────────────────────────────────────────────
	useEffect(() => {
		if (mapRef.current || !mapContainerRef.current) return;

		import("leaflet").then((L) => {
			setLeafletLib(L);

			// @ts-ignore
			delete L.Icon.Default.prototype._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl:
					"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
				iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
				shadowUrl:
					"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
			});

			const map = L.map(mapContainerRef.current!).setView(
				[selectedLat ?? 27.7172, selectedLng ?? 85.324],
				selectedLat ? 12 : 7,
			);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 19,
			}).addTo(map);

			if (selectedLat && selectedLng) {
				markerRef.current = L.marker([selectedLat, selectedLng]).addTo(map);
			}

			map.on("click", async (e: any) => {
				const { lat, lng } = e.latlng;
				if (markerRef.current) map.removeLayer(markerRef.current);
				markerRef.current = L.marker([lat, lng]).addTo(map);
				const name = await reverseGeocode(lat, lng);
				onSelect({ lat, lng, name });
			});

			mapRef.current = map;
		});

		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
				markerRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ── Init expanded map when modal opens ───────────────────────
	useEffect(() => {
		if (
			!expanded ||
			!expandedMapRef.current ||
			expandedMapObjRef.current ||
			!leafletLib
		)
			return;

		const L = leafletLib;
		const lat = markerRef.current?._latlng?.lat ?? selectedLat ?? 27.7172;
		const lng = markerRef.current?._latlng?.lng ?? selectedLng ?? 85.324;

		const t = setTimeout(() => {
			if (!expandedMapRef.current) return;

			const map = L.map(expandedMapRef.current).setView(
				[lat, lng],
				selectedLat ? 13 : 7,
			);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 19,
			}).addTo(map);

			// Mirror existing marker into expanded map
			if (markerRef.current?._latlng) {
				const { lat: mLat, lng: mLng } = markerRef.current._latlng;
				expandedMarkerRef.current = L.marker([mLat, mLng]).addTo(map);
			}

			map.on("click", async (e: any) => {
				const { lat: cLat, lng: cLng } = e.latlng;

				// Update expanded marker
				if (expandedMarkerRef.current)
					map.removeLayer(expandedMarkerRef.current);
				expandedMarkerRef.current = L.marker([cLat, cLng]).addTo(map);

				// Sync back to small map
				if (mapRef.current) {
					if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
					markerRef.current = L.marker([cLat, cLng]).addTo(mapRef.current);
					mapRef.current.setView([cLat, cLng], 12);
				}

				const name = await reverseGeocode(cLat, cLng);
				onSelect({ lat: cLat, lng: cLng, name });
			});

			expandedMapObjRef.current = map;
			setTimeout(() => map.invalidateSize(), 100);
		}, 50);

		return () => clearTimeout(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expanded, leafletLib]);

	// ── Close expanded map ───────────────────────────────────────
	const closeExpanded = () => {
		if (expandedMapObjRef.current) {
			expandedMapObjRef.current.remove();
			expandedMapObjRef.current = null;
			expandedMarkerRef.current = null;
		}
		setExpanded(false);
	};

	// ── Locate me ────────────────────────────────────────────────
	const handleLocateMe = (inExpanded = false) => {
		if (!navigator.geolocation || !leafletLib) return;
		setLocating(true);
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const { latitude: lat, longitude: lng } = pos.coords;
				const L = leafletLib;

				// Always update small map
				if (mapRef.current) {
					if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
					markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
					mapRef.current.setView([lat, lng], 13);
				}

				// Update expanded map if triggered from there
				if (inExpanded && expandedMapObjRef.current) {
					if (expandedMarkerRef.current)
						expandedMapObjRef.current.removeLayer(expandedMarkerRef.current);
					expandedMarkerRef.current = L.marker([lat, lng]).addTo(
						expandedMapObjRef.current,
					);
					expandedMapObjRef.current.setView([lat, lng], 13);
				}

				const name = await reverseGeocode(lat, lng);
				onSelect({ lat, lng, name });
				setLocating(false);
			},
			() => setLocating(false),
			{ timeout: 8000 },
		);
	};

	return (
		<>
			{/* ── Small inline map ──────────────────────────────── */}
			<div className="relative rounded-2xl overflow-hidden border-2 border-setu-200">
				<div
					ref={mapContainerRef}
					className="w-full h-64"
				/>

				{/* Locate me */}
				<button
					type="button"
					onClick={() => handleLocateMe(false)}
					disabled={locating}
					className="absolute bottom-3 right-14 z-[1000] flex items-center gap-1.5 px-3 py-2 bg-white border border-setu-200 text-setu-700 text-[12px] font-semibold rounded-xl shadow-md hover:bg-setu-50 transition-all cursor-pointer disabled:opacity-60">
					{locating ? (
						<Loader2 className="w-3.5 h-3.5 animate-spin" />
					) : (
						<Navigation className="w-3.5 h-3.5" />
					)}
					{locating ? "Locating…" : "Locate me"}
				</button>

				{/* Expand button */}
				<button
					type="button"
					onClick={() => setExpanded(true)}
					className="absolute bottom-3 right-3 z-[1000] w-9 h-9 bg-white border border-setu-200 text-setu-700 rounded-xl shadow-md hover:bg-setu-50 transition-all cursor-pointer flex items-center justify-center"
					title="Expand map">
					<Maximize2 className="w-4 h-4" />
				</button>

				{/* Hint overlay */}
				<div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm border border-setu-100 rounded-xl px-3 py-1.5 shadow-sm pointer-events-none">
					<p className="text-[11px] font-semibold text-setu-700 flex items-center gap-1.5">
						<MapPin className="w-3 h-3" /> Click on the map to pin your location
					</p>
				</div>
			</div>

			{/* ── Expanded modal ────────────────────────────────── */}
			{expanded && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.3)] flex flex-col">
						{/* Modal header */}
						<div className="flex items-center justify-between px-5 py-4 border-b border-setu-100 bg-white flex-shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="w-8 h-8 bg-setu-50 border border-setu-200 rounded-xl flex items-center justify-center flex-shrink-0">
									<MapPin className="w-4 h-4 text-setu-600" />
								</div>
								<div>
									<p className="text-[14px] font-bold text-setu-950">
										Pick a Location
									</p>
									<p className="text-[11px] text-setu-600/60">
										Click anywhere on the map to pin your location
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								{/* Locate me in expanded */}
								<button
									type="button"
									onClick={() => handleLocateMe(true)}
									disabled={locating}
									className="flex items-center gap-1.5 px-3 py-2 bg-setu-50 border border-setu-200 text-setu-700 text-[12px] font-semibold rounded-xl hover:bg-setu-100 transition-all cursor-pointer disabled:opacity-60">
									{locating ? (
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
									) : (
										<Navigation className="w-3.5 h-3.5" />
									)}
									{locating ? "Locating…" : "Locate me"}
								</button>

								{/* Minimize */}
								<button
									type="button"
									onClick={closeExpanded}
									className="flex items-center gap-1.5 px-3 py-2 bg-setu-50 border border-setu-200 text-setu-700 text-[12px] font-semibold rounded-xl hover:bg-setu-100 transition-all cursor-pointer">
									<Minimize2 className="w-3.5 h-3.5" /> Minimize
								</button>

								{/* Close X */}
								<button
									type="button"
									onClick={closeExpanded}
									className="w-9 h-9 bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-xl flex items-center justify-center transition-all cursor-pointer border-none">
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Expanded map fills rest of modal */}
						<div
							ref={expandedMapRef}
							className="flex-1 w-full"
						/>
					</div>
				</div>
			)}
		</>
	);
}
