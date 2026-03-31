/**
 * Mock data service — simulates backend API responses.
 * All data is in-memory. Swap with real API calls when backend is ready.
 */

import type { Bus, Route, Trip, Alert, User } from './types';

// ── Chennai-centered coordinates ─────────────────────────────────────────────
const CHENNAI = { lat: 13.0827, lng: 80.2707 };

const jitter = (base: number, range: number) =>
    base + (Math.random() - 0.5) * range;

// ── Mock Users ───────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Arjun Commuter', email: 'arjun@ezybus.com', role: 'commuter', createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z' },
    { id: 'u2', name: 'Priya Commuter', email: 'priya@ezybus.com', role: 'commuter', createdAt: '2025-01-12T00:00:00Z', updatedAt: '2025-01-12T00:00:00Z' },
    { id: 'u3', name: 'Ravi Conductor', email: 'ravi@ezybus.com', role: 'conductor', createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z' },
    { id: 'u4', name: 'Kavya Conductor', email: 'kavya@ezybus.com', role: 'conductor', createdAt: '2025-02-05T00:00:00Z', updatedAt: '2025-02-05T00:00:00Z' },
    { id: 'u5', name: 'Admin User', email: 'admin@ezybus.com', role: 'admin', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
];

// ── Mock Routes ──────────────────────────────────────────────────────────────
export const MOCK_ROUTES: Route[] = [
    {
        id: 'r1', name: 'Route 101', origin: 'Chennai Central', destination: 'Chennai Airport',
        estimatedDuration: 45, distance: 22, active: true, color: '#6366f1', path: [{"lat": 13.082697, "lng": 80.270678}, {"lat": 13.081473, "lng": 80.270911}, {"lat": 13.081209, "lng": 80.270987}, {"lat": 13.081109, "lng": 80.271179}, {"lat": 13.081135, "lng": 80.27145}, {"lat": 13.081276, "lng": 80.2721}, {"lat": 13.081332, "lng": 80.272491}, {"lat": 13.081441, "lng": 80.272994}, {"lat": 13.081588, "lng": 80.273741}, {"lat": 13.081414, "lng": 80.273425}, {"lat": 13.081052, "lng": 80.271539}, {"lat": 13.080903, "lng": 80.271008}, {"lat": 13.080796, "lng": 80.270718}, {"lat": 13.080764, "lng": 80.270198}, {"lat": 13.080611, "lng": 80.265251}, {"lat": 13.078682, "lng": 80.265456}, {"lat": 13.077807, "lng": 80.265556}, {"lat": 13.077107, "lng": 80.265569}, {"lat": 13.076606, "lng": 80.265466}, {"lat": 13.076431, "lng": 80.265463}, {"lat": 13.07629, "lng": 80.265427}, {"lat": 13.076295, "lng": 80.265265}, {"lat": 13.076117, "lng": 80.265029}, {"lat": 13.075866, "lng": 80.264526}, {"lat": 13.075408, "lng": 80.263817}, {"lat": 13.074152, "lng": 80.262203}, {"lat": 13.073381, "lng": 80.261389}, {"lat": 13.073127, "lng": 80.261303}, {"lat": 13.073073, "lng": 80.261184}, {"lat": 13.073161, "lng": 80.260793}, {"lat": 13.073287, "lng": 80.260816}, {"lat": 13.073272, "lng": 80.260974}, {"lat": 13.073157, "lng": 80.26098}, {"lat": 13.073031, "lng": 80.26082}, {"lat": 13.072441, "lng": 80.26012}, {"lat": 13.071999, "lng": 80.259644}, {"lat": 13.069854, "lng": 80.25725}, {"lat": 13.068293, "lng": 80.255649}, {"lat": 13.067375, "lng": 80.254963}, {"lat": 13.067038, "lng": 80.255156}, {"lat": 13.065908, "lng": 80.256465}, {"lat": 13.065402, "lng": 80.257186}, {"lat": 13.065035, "lng": 80.257973}, {"lat": 13.064357, "lng": 80.259143}, {"lat": 13.063657, "lng": 80.260899}, {"lat": 13.063393, "lng": 80.261935}, {"lat": 13.062047, "lng": 80.262974}, {"lat": 13.061895, "lng": 80.262876}, {"lat": 13.060551, "lng": 80.261243}, {"lat": 13.059055, "lng": 80.259409}, {"lat": 13.057448, "lng": 80.257774}, {"lat": 13.056129, "lng": 80.257822}, {"lat": 13.05487, "lng": 80.257832}, {"lat": 13.052482, "lng": 80.257765}, {"lat": 13.052176, "lng": 80.261012}, {"lat": 13.052328, "lng": 80.261159}, {"lat": 13.054049, "lng": 80.261731}, {"lat": 13.054169, "lng": 80.260764}, {"lat": 13.054359, "lng": 80.257942}, {"lat": 13.05469, "lng": 80.254836}, {"lat": 13.054392, "lng": 80.25391}, {"lat": 13.052105, "lng": 80.250753}, {"lat": 13.051064, "lng": 80.25018}, {"lat": 13.050714, "lng": 80.250482}, {"lat": 13.051596, "lng": 80.250598}, {"lat": 13.051621, "lng": 80.250103}, {"lat": 13.050654, "lng": 80.24896}, {"lat": 13.049564, "lng": 80.247721}, {"lat": 13.048543, "lng": 80.246357}, {"lat": 13.047891, "lng": 80.245396}, {"lat": 13.046982, "lng": 80.243757}, {"lat": 13.046396, "lng": 80.24268}, {"lat": 13.045734, "lng": 80.24161}, {"lat": 13.044556, "lng": 80.240626}, {"lat": 13.042242, "lng": 80.24075}, {"lat": 13.040393, "lng": 80.240509}, {"lat": 13.039872, "lng": 80.239876}, {"lat": 13.037605, "lng": 80.239601}, {"lat": 13.035453, "lng": 80.239338}, {"lat": 13.035031, "lng": 80.238611}, {"lat": 13.034249, "lng": 80.237316}, {"lat": 13.033139, "lng": 80.236997}, {"lat": 13.031579, "lng": 80.237107}, {"lat": 13.031359, "lng": 80.237207}, {"lat": 13.031183, "lng": 80.237194}, {"lat": 13.031201, "lng": 80.237013}, {"lat": 13.031036, "lng": 80.236632}, {"lat": 13.028667, "lng": 80.234005}, {"lat": 13.027582, "lng": 80.233704}, {"lat": 13.026496, "lng": 80.233073}, {"lat": 13.02554, "lng": 80.230389}, {"lat": 13.024287, "lng": 80.228592}, {"lat": 13.022342, "lng": 80.226643}, {"lat": 13.020375, "lng": 80.225136}, {"lat": 13.019612, "lng": 80.224604}, {"lat": 13.019075, "lng": 80.224486}, {"lat": 13.018776, "lng": 80.22455}, {"lat": 13.014714, "lng": 80.226112}, {"lat": 13.012912, "lng": 80.22685}, {"lat": 13.010325, "lng": 80.22784}, {"lat": 13.009542, "lng": 80.227692}, {"lat": 13.010756, "lng": 80.224857}, {"lat": 13.011403, "lng": 80.223255}, {"lat": 13.007174, "lng": 80.221007}, {"lat": 13.006879, "lng": 80.220718}, {"lat": 13.009284, "lng": 80.221994}, {"lat": 13.011201, "lng": 80.22307}, {"lat": 13.011496, "lng": 80.223024}, {"lat": 13.011942, "lng": 80.221836}, {"lat": 13.012113, "lng": 80.221307}, {"lat": 13.011282, "lng": 80.218362}, {"lat": 13.010708, "lng": 80.21688}, {"lat": 13.010153, "lng": 80.21558}, {"lat": 13.009112, "lng": 80.212315}, {"lat": 13.008479, "lng": 80.210635}, {"lat": 13.00791, "lng": 80.208379}, {"lat": 13.007481, "lng": 80.205691}, {"lat": 13.007346, "lng": 80.205273}, {"lat": 13.007116, "lng": 80.204727}, {"lat": 13.00677, "lng": 80.204066}, {"lat": 13.006258, "lng": 80.203289}, {"lat": 13.005789, "lng": 80.202667}, {"lat": 13.005062, "lng": 80.20161}, {"lat": 13.004252, "lng": 80.201122}, {"lat": 13.002761, "lng": 80.200762}, {"lat": 13.002082, "lng": 80.200367}, {"lat": 13.001763, "lng": 80.199559}, {"lat": 13.001791, "lng": 80.199106}, {"lat": 13.001975, "lng": 80.197389}, {"lat": 13.001466, "lng": 80.196119}, {"lat": 12.999994, "lng": 80.194263}, {"lat": 12.998271, "lng": 80.192095}, {"lat": 12.99563, "lng": 80.188781}, {"lat": 12.994967, "lng": 80.187552}, {"lat": 12.994497, "lng": 80.186614}, {"lat": 12.993546, "lng": 80.184769}, {"lat": 12.990176, "lng": 80.179885}, {"lat": 12.987276, "lng": 80.176025}, {"lat": 12.985945, "lng": 80.174097}, {"lat": 12.981574, "lng": 80.167118}, {"lat": 12.981679, "lng": 80.16681}, {"lat": 12.984399, "lng": 80.171541}, {"lat": 12.986477, "lng": 80.174478}, {"lat": 12.987121, "lng": 80.174801}, {"lat": 12.987289, "lng": 80.173424}, {"lat": 12.987296, "lng": 80.171753}],
        stops: [
            { name: 'Chennai Central', location: { lat: 13.0827, lng: 80.2707 } },
            { name: 'Egmore', location: { lat: 13.0732, lng: 80.2609 } },
            { name: 'Royapettah', location: { lat: 13.0524, lng: 80.2606 } },
            { name: 'Guindy', location: { lat: 13.0068, lng: 80.2206 } },
            { name: 'Chennai Airport', location: { lat: 12.9941, lng: 80.1709 } },
        ],
    },
    {
        id: 'r2', name: 'Route 202', origin: 'T. Nagar', destination: 'Guindy',
        estimatedDuration: 30, distance: 12, active: true, color: '#06b6d4', path: [{"lat": 13.040797, "lng": 80.233714}, {"lat": 13.042006, "lng": 80.233177}, {"lat": 13.042165, "lng": 80.232668}, {"lat": 13.041474, "lng": 80.233993}, {"lat": 13.040958, "lng": 80.236112}, {"lat": 13.039094, "lng": 80.239778}, {"lat": 13.037185, "lng": 80.239549}, {"lat": 13.035362, "lng": 80.239323}, {"lat": 13.034769, "lng": 80.238186}, {"lat": 13.034198, "lng": 80.237206}, {"lat": 13.034662, "lng": 80.233118}, {"lat": 13.034267, "lng": 80.230455}, {"lat": 13.031937, "lng": 80.230656}, {"lat": 13.030593, "lng": 80.230021}, {"lat": 13.030322, "lng": 80.228891}, {"lat": 13.030423, "lng": 80.227488}, {"lat": 13.029348, "lng": 80.227321}, {"lat": 13.028404, "lng": 80.227167}, {"lat": 13.027917, "lng": 80.226881}, {"lat": 13.028485, "lng": 80.224022}, {"lat": 13.02866, "lng": 80.219908}, {"lat": 13.029455, "lng": 80.217309}, {"lat": 13.028798, "lng": 80.219939}, {"lat": 13.027178, "lng": 80.219753}, {"lat": 13.025375, "lng": 80.21979}, {"lat": 13.025076, "lng": 80.222143}, {"lat": 13.025209, "lng": 80.22343}, {"lat": 13.025275, "lng": 80.226012}, {"lat": 13.02504, "lng": 80.22796}, {"lat": 13.024716, "lng": 80.228955}, {"lat": 13.025243, "lng": 80.229939}, {"lat": 13.024078, "lng": 80.228327}, {"lat": 13.021803, "lng": 80.226191}, {"lat": 13.020084, "lng": 80.224913}, {"lat": 13.019499, "lng": 80.224556}, {"lat": 13.019032, "lng": 80.224489}, {"lat": 13.016783, "lng": 80.225356}, {"lat": 13.014425, "lng": 80.226213}, {"lat": 13.012725, "lng": 80.226922}, {"lat": 13.009941, "lng": 80.227931}, {"lat": 13.009569, "lng": 80.227578}, {"lat": 13.010809, "lng": 80.224726}, {"lat": 13.010512, "lng": 80.222853}, {"lat": 13.007094, "lng": 80.220963}],
        stops: [
            { name: 'T. Nagar', location: { lat: 13.0408, lng: 80.2337 } },
            { name: 'Ashok Nagar', location: { lat: 13.0294, lng: 80.2186 } },
            { name: 'Guindy', location: { lat: 13.0068, lng: 80.2206 } },
        ],
    },
    {
        id: 'r3', name: 'Route 303', origin: 'Anna Nagar', destination: 'Tambaram',
        estimatedDuration: 55, distance: 28, active: true, color: '#10b981', path: [{"lat": 13.089195, "lng": 80.210347}, {"lat": 13.085588, "lng": 80.210211}, {"lat": 13.084853, "lng": 80.210237}, {"lat": 13.085158, "lng": 80.202965}, {"lat": 13.083978, "lng": 80.200316}, {"lat": 13.08285, "lng": 80.199319}, {"lat": 13.081292, "lng": 80.198578}, {"lat": 13.077073, "lng": 80.199103}, {"lat": 13.075812, "lng": 80.199253}, {"lat": 13.074177, "lng": 80.199994}, {"lat": 13.071997, "lng": 80.202463}, {"lat": 13.06952, "lng": 80.205566}, {"lat": 13.067715, "lng": 80.208619}, {"lat": 13.066858, "lng": 80.209865}, {"lat": 13.065099, "lng": 80.211245}, {"lat": 13.063688, "lng": 80.211719}, {"lat": 13.06147, "lng": 80.211763}, {"lat": 13.059988, "lng": 80.211705}, {"lat": 13.058004, "lng": 80.211633}, {"lat": 13.055127, "lng": 80.211573}, {"lat": 13.053274, "lng": 80.211875}, {"lat": 13.051478, "lng": 80.212255}, {"lat": 13.050119, "lng": 80.212186}, {"lat": 13.050009, "lng": 80.212915}, {"lat": 13.049004, "lng": 80.212925}, {"lat": 13.047046, "lng": 80.21235}, {"lat": 13.044393, "lng": 80.212443}, {"lat": 13.041907, "lng": 80.212438}, {"lat": 13.037459, "lng": 80.212442}, {"lat": 13.034841, "lng": 80.212239}, {"lat": 13.034039, "lng": 80.212052}, {"lat": 13.032689, "lng": 80.211907}, {"lat": 13.032007, "lng": 80.211918}, {"lat": 13.031444, "lng": 80.215648}, {"lat": 13.030878, "lng": 80.216971}, {"lat": 13.029455, "lng": 80.217309}, {"lat": 13.028798, "lng": 80.219939}, {"lat": 13.027178, "lng": 80.219753}, {"lat": 13.025375, "lng": 80.21979}, {"lat": 13.023174, "lng": 80.219603}, {"lat": 13.021179, "lng": 80.219494}, {"lat": 13.019452, "lng": 80.219489}, {"lat": 13.018308, "lng": 80.218711}, {"lat": 13.017593, "lng": 80.217988}, {"lat": 13.016405, "lng": 80.215952}, {"lat": 13.016208, "lng": 80.215649}, {"lat": 13.015755, "lng": 80.215294}, {"lat": 13.012482, "lng": 80.213342}, {"lat": 13.012704, "lng": 80.211538}, {"lat": 13.013172, "lng": 80.209829}, {"lat": 13.013109, "lng": 80.209735}, {"lat": 13.012862, "lng": 80.20872}, {"lat": 13.012835, "lng": 80.207996}, {"lat": 13.012904, "lng": 80.207605}, {"lat": 13.01302, "lng": 80.20625}, {"lat": 13.013505, "lng": 80.204355}, {"lat": 13.012421, "lng": 80.203989}, {"lat": 13.010406, "lng": 80.20371}, {"lat": 13.008284, "lng": 80.203838}, {"lat": 13.007102, "lng": 80.203715}, {"lat": 13.00619, "lng": 80.202984}, {"lat": 13.005399, "lng": 80.20173}, {"lat": 13.004598, "lng": 80.20122}, {"lat": 13.00352, "lng": 80.20095}, {"lat": 13.002274, "lng": 80.200544}, {"lat": 13.001861, "lng": 80.199938}, {"lat": 13.001757, "lng": 80.199357}, {"lat": 13.001924, "lng": 80.197851}, {"lat": 13.001869, "lng": 80.196729}, {"lat": 13.001314, "lng": 80.195913}, {"lat": 12.998673, "lng": 80.192629}, {"lat": 12.996032, "lng": 80.189368}, {"lat": 12.995204, "lng": 80.187993}, {"lat": 12.994776, "lng": 80.187158}, {"lat": 12.993919, "lng": 80.185461}, {"lat": 12.992274, "lng": 80.182582}, {"lat": 12.988669, "lng": 80.177948}, {"lat": 12.987167, "lng": 80.175882}, {"lat": 12.982218, "lng": 80.168177}, {"lat": 12.980684, "lng": 80.165492}, {"lat": 12.97987, "lng": 80.162948}, {"lat": 12.978755, "lng": 80.161209}, {"lat": 12.974932, "lng": 80.155608}, {"lat": 12.972657, "lng": 80.152242}, {"lat": 12.972084, "lng": 80.151526}, {"lat": 12.969588, "lng": 80.150223}, {"lat": 12.967378, "lng": 80.149214}, {"lat": 12.965386, "lng": 80.148217}, {"lat": 12.963919, "lng": 80.147381}, {"lat": 12.963201, "lng": 80.147075}, {"lat": 12.960338, "lng": 80.145556}, {"lat": 12.960053, "lng": 80.145368}, {"lat": 12.957313, "lng": 80.143848}, {"lat": 12.955988, "lng": 80.144074}, {"lat": 12.955614, "lng": 80.145095}, {"lat": 12.954269, "lng": 80.145587}, {"lat": 12.953703, "lng": 80.146131}, {"lat": 12.953183, "lng": 80.146734}, {"lat": 12.951932, "lng": 80.147332}, {"lat": 12.951138, "lng": 80.145959}, {"lat": 12.951107, "lng": 80.143348}, {"lat": 12.951581, "lng": 80.141945}, {"lat": 12.946653, "lng": 80.137737}, {"lat": 12.946454, "lng": 80.137895}, {"lat": 12.946353, "lng": 80.138235}, {"lat": 12.944812, "lng": 80.138043}, {"lat": 12.943803, "lng": 80.137994}, {"lat": 12.942092, "lng": 80.138007}, {"lat": 12.93915, "lng": 80.138325}, {"lat": 12.937627, "lng": 80.138775}, {"lat": 12.936709, "lng": 80.138765}, {"lat": 12.936089, "lng": 80.138315}, {"lat": 12.934545, "lng": 80.138288}, {"lat": 12.93328, "lng": 80.13797}, {"lat": 12.932565, "lng": 80.137656}, {"lat": 12.93143, "lng": 80.137429}, {"lat": 12.931086, "lng": 80.136962}, {"lat": 12.930666, "lng": 80.136736}, {"lat": 12.929272, "lng": 80.136479}, {"lat": 12.928236, "lng": 80.136383}, {"lat": 12.928114, "lng": 80.135508}, {"lat": 12.927228, "lng": 80.135371}, {"lat": 12.926549, "lng": 80.135515}, {"lat": 12.925368, "lng": 80.135201}, {"lat": 12.923615, "lng": 80.135105}, {"lat": 12.922672, "lng": 80.135056}, {"lat": 12.922649, "lng": 80.133006}, {"lat": 12.922741, "lng": 80.130435}, {"lat": 12.922793, "lng": 80.129461}, {"lat": 12.923032, "lng": 80.123989}, {"lat": 12.923255, "lng": 80.120364}, {"lat": 12.923513, "lng": 80.11799}, {"lat": 12.923958, "lng": 80.115375}, {"lat": 12.924131, "lng": 80.115044}, {"lat": 12.924806, "lng": 80.111815}, {"lat": 12.92519, "lng": 80.109476}, {"lat": 12.925341, "lng": 80.108543}, {"lat": 12.925725, "lng": 80.106373}, {"lat": 12.925745, "lng": 80.106242}, {"lat": 12.925739, "lng": 80.105473}, {"lat": 12.925532, "lng": 80.103907}, {"lat": 12.925665, "lng": 80.10275}, {"lat": 12.925534, "lng": 80.101615}, {"lat": 12.925088, "lng": 80.100565}],
        stops: [
            { name: 'Anna Nagar', location: { lat: 13.0892, lng: 80.2102 } },
            { name: 'Vadapalani', location: { lat: 13.0511, lng: 80.2124 } },
            { name: 'Ashok Nagar', location: { lat: 13.0294, lng: 80.2186 } },
            { name: 'Chrompet', location: { lat: 12.9516, lng: 80.1462 } },
            { name: 'Tambaram', location: { lat: 12.9249, lng: 80.1000 } },
        ],
    },
    {
        id: 'r4', name: 'Route 404', origin: 'Adyar', destination: 'Velachery',
        estimatedDuration: 25, distance: 10, active: true, color: '#f59e0b', path: [{"lat": 13.001196, "lng": 80.256534}, {"lat": 12.999506, "lng": 80.256136}, {"lat": 13.001582, "lng": 80.256511}, {"lat": 13.00407, "lng": 80.256956}, {"lat": 13.005421, "lng": 80.257237}, {"lat": 13.006507, "lng": 80.257095}, {"lat": 13.006494, "lng": 80.25437}, {"lat": 13.006612, "lng": 80.251946}, {"lat": 13.006677, "lng": 80.248428}, {"lat": 13.00666, "lng": 80.247662}, {"lat": 13.006529, "lng": 80.246754}, {"lat": 13.006645, "lng": 80.246384}, {"lat": 13.006611, "lng": 80.244523}, {"lat": 13.006602, "lng": 80.242876}, {"lat": 13.005555, "lng": 80.242164}, {"lat": 13.005284, "lng": 80.241878}, {"lat": 13.004178, "lng": 80.241806}, {"lat": 13.003565, "lng": 80.240525}, {"lat": 13.002323, "lng": 80.24004}, {"lat": 13.001044, "lng": 80.239655}, {"lat": 12.998951, "lng": 80.23929}, {"lat": 12.998021, "lng": 80.238956}, {"lat": 12.996982, "lng": 80.237632}, {"lat": 12.995741, "lng": 80.235652}, {"lat": 12.994023, "lng": 80.234611}, {"lat": 12.993049, "lng": 80.233925}, {"lat": 12.991631, "lng": 80.233821}, {"lat": 12.991468, "lng": 80.233781}, {"lat": 12.991427, "lng": 80.23361}, {"lat": 12.991552, "lng": 80.233615}, {"lat": 12.991866, "lng": 80.233709}, {"lat": 12.993201, "lng": 80.233995}, {"lat": 12.9945, "lng": 80.234889}, {"lat": 12.996234, "lng": 80.236249}, {"lat": 12.997405, "lng": 80.2383}, {"lat": 12.998397, "lng": 80.239122}, {"lat": 12.999922, "lng": 80.239507}, {"lat": 13.001966, "lng": 80.23992}, {"lat": 13.003012, "lng": 80.240234}, {"lat": 13.003996, "lng": 80.241565}, {"lat": 13.005289, "lng": 80.241832}, {"lat": 13.005378, "lng": 80.241793}, {"lat": 13.005424, "lng": 80.241883}, {"lat": 13.006051, "lng": 80.242339}, {"lat": 13.006589, "lng": 80.241869}, {"lat": 13.006846, "lng": 80.239931}, {"lat": 13.007318, "lng": 80.237604}, {"lat": 13.007506, "lng": 80.236644}, {"lat": 13.009127, "lng": 80.228425}, {"lat": 13.010328, "lng": 80.225815}, {"lat": 13.011063, "lng": 80.224104}, {"lat": 13.007951, "lng": 80.221423}, {"lat": 13.005343, "lng": 80.220425}, {"lat": 13.002572, "lng": 80.21963}, {"lat": 13.001538, "lng": 80.218591}, {"lat": 13.001019, "lng": 80.218249}, {"lat": 12.998333, "lng": 80.216695}, {"lat": 12.997174, "lng": 80.216553}, {"lat": 12.995384, "lng": 80.2169}, {"lat": 12.991478, "lng": 80.219647}, {"lat": 12.98994, "lng": 80.220844}, {"lat": 12.988982, "lng": 80.22201}, {"lat": 12.988272, "lng": 80.222741}, {"lat": 12.98774, "lng": 80.223083}, {"lat": 12.986177, "lng": 80.222973}, {"lat": 12.985113, "lng": 80.223262}, {"lat": 12.983993, "lng": 80.222628}, {"lat": 12.982763, "lng": 80.221899}, {"lat": 12.981247, "lng": 80.221086}, {"lat": 12.980178, "lng": 80.221083}, {"lat": 12.979587, "lng": 80.221109}, {"lat": 12.978755, "lng": 80.221148}, {"lat": 12.978807, "lng": 80.221034}],
        stops: [
            { name: 'Adyar', location: { lat: 13.0012, lng: 80.2565 } },
            { name: 'Kotturpuram', location: { lat: 13.0014, lng: 80.2397 } },
            { name: 'Velachery', location: { lat: 12.9788, lng: 80.2209 } },
        ],
    },
    {
        id: 'r5', name: 'Route 505', origin: 'Porur', destination: 'T. Nagar',
        estimatedDuration: 40, distance: 18, active: true, color: '#8b5cf6', path: [{"lat": 13.034955, "lng": 80.155329}, {"lat": 13.036189, "lng": 80.152902}, {"lat": 13.036373, "lng": 80.152273}, {"lat": 13.035983, "lng": 80.153714}, {"lat": 13.035056, "lng": 80.155564}, {"lat": 13.036196, "lng": 80.157016}, {"lat": 13.036833, "lng": 80.157897}, {"lat": 13.037285, "lng": 80.158827}, {"lat": 13.037602, "lng": 80.159865}, {"lat": 13.037908, "lng": 80.161856}, {"lat": 13.038163, "lng": 80.16321}, {"lat": 13.038289, "lng": 80.16413}, {"lat": 13.038411, "lng": 80.166078}, {"lat": 13.038676, "lng": 80.167478}, {"lat": 13.038969, "lng": 80.168921}, {"lat": 13.039237, "lng": 80.16954}, {"lat": 13.039842, "lng": 80.170658}, {"lat": 13.040419, "lng": 80.171702}, {"lat": 13.040766, "lng": 80.172448}, {"lat": 13.041314, "lng": 80.174126}, {"lat": 13.041971, "lng": 80.176528}, {"lat": 13.042075, "lng": 80.17743}, {"lat": 13.042036, "lng": 80.178311}, {"lat": 13.042052, "lng": 80.179428}, {"lat": 13.042243, "lng": 80.180318}, {"lat": 13.042486, "lng": 80.181182}, {"lat": 13.042781, "lng": 80.181847}, {"lat": 13.043191, "lng": 80.182244}, {"lat": 13.043647, "lng": 80.183204}, {"lat": 13.044376, "lng": 80.184886}, {"lat": 13.044926, "lng": 80.185998}, {"lat": 13.045691, "lng": 80.187054}, {"lat": 13.045888, "lng": 80.18745}, {"lat": 13.046258, "lng": 80.18849}, {"lat": 13.046567, "lng": 80.190199}, {"lat": 13.046587, "lng": 80.190861}, {"lat": 13.046671, "lng": 80.192315}, {"lat": 13.046747, "lng": 80.193672}, {"lat": 13.046908, "lng": 80.19421}, {"lat": 13.047438, "lng": 80.195078}, {"lat": 13.047515, "lng": 80.196582}, {"lat": 13.04751, "lng": 80.198167}, {"lat": 13.047487, "lng": 80.199289}, {"lat": 13.047444, "lng": 80.200745}, {"lat": 13.047485, "lng": 80.201847}, {"lat": 13.047613, "lng": 80.202144}, {"lat": 13.048073, "lng": 80.203998}, {"lat": 13.048865, "lng": 80.206843}, {"lat": 13.049421, "lng": 80.208532}, {"lat": 13.049529, "lng": 80.209135}, {"lat": 13.04973, "lng": 80.210571}, {"lat": 13.049947, "lng": 80.21188}, {"lat": 13.052036, "lng": 80.212439}, {"lat": 13.050632, "lng": 80.212202}, {"lat": 13.050071, "lng": 80.212806}, {"lat": 13.050753, "lng": 80.21503}, {"lat": 13.051616, "lng": 80.217626}, {"lat": 13.052166, "lng": 80.219198}, {"lat": 13.051918, "lng": 80.220155}, {"lat": 13.050763, "lng": 80.219942}, {"lat": 13.049142, "lng": 80.219485}, {"lat": 13.047718, "lng": 80.219095}, {"lat": 13.04543, "lng": 80.218471}, {"lat": 13.043303, "lng": 80.218108}, {"lat": 13.043782, "lng": 80.218469}, {"lat": 13.04306, "lng": 80.22131}, {"lat": 13.041876, "lng": 80.226345}, {"lat": 13.041296, "lng": 80.228512}, {"lat": 13.040948, "lng": 80.230315}, {"lat": 13.040621, "lng": 80.231789}, {"lat": 13.041041, "lng": 80.231993}, {"lat": 13.042205, "lng": 80.232433}, {"lat": 13.042006, "lng": 80.233177}, {"lat": 13.040797, "lng": 80.233714}],
        stops: [
            { name: 'Porur', location: { lat: 13.0349, lng: 80.1553 } },
            { name: 'Vadapalani', location: { lat: 13.0511, lng: 80.2124 } },
            { name: 'T. Nagar', location: { lat: 13.0408, lng: 80.2337 } },
        ],
    },
    {
        id: 'r6', name: 'Route 606', origin: 'Koyambedu', destination: 'Mylapore',
        estimatedDuration: 35, distance: 14, active: true, color: '#f43f5e',
        path: [{"lat":13.069717,"lng":80.196773},{"lat":13.068498,"lng":80.197201},{"lat":13.066971,"lng":80.197654},{"lat":13.065408,"lng":80.198013},{"lat":13.063785,"lng":80.198405},{"lat":13.061892,"lng":80.198853},{"lat":13.060008,"lng":80.199319},{"lat":13.058111,"lng":80.199780},{"lat":13.055969,"lng":80.200339},{"lat":13.054003,"lng":80.200804},{"lat":13.052089,"lng":80.201291},{"lat":13.050175,"lng":80.201773},{"lat":13.048245,"lng":80.202258},{"lat":13.046324,"lng":80.202736},{"lat":13.044397,"lng":80.203211},{"lat":13.042487,"lng":80.203694},{"lat":13.040581,"lng":80.204170},{"lat":13.039044,"lng":80.204682},{"lat":13.037517,"lng":80.205390},{"lat":13.035969,"lng":80.206292},{"lat":13.034629,"lng":80.207340},{"lat":13.033285,"lng":80.208516},{"lat":13.031918,"lng":80.209695},{"lat":13.030689,"lng":80.210769},{"lat":13.029428,"lng":80.211963},{"lat":13.028248,"lng":80.213108},{"lat":13.027022,"lng":80.214262},{"lat":13.025780,"lng":80.215374},{"lat":13.024600,"lng":80.216516},{"lat":13.023388,"lng":80.217671},{"lat":13.022246,"lng":80.218711},{"lat":13.021047,"lng":80.219869},{"lat":13.019917,"lng":80.220904},{"lat":13.018792,"lng":80.221870},{"lat":13.017591,"lng":80.222930},{"lat":13.016350,"lng":80.223971},{"lat":13.015210,"lng":80.224918},{"lat":13.013991,"lng":80.225985},{"lat":13.012796,"lng":80.227040},{"lat":13.011614,"lng":80.228053},{"lat":13.010428,"lng":80.229082},{"lat":13.009353,"lng":80.230154},{"lat":13.008234,"lng":80.231353},{"lat":13.007203,"lng":80.232498},{"lat":13.006134,"lng":80.233614},{"lat":13.005000,"lng":80.234788},{"lat":13.003905,"lng":80.235829},{"lat":13.002762,"lng":80.236899},{"lat":13.001696,"lng":80.237907},{"lat":13.000618,"lng":80.238936},{"lat":12.999424,"lng":80.239958}],
        stops: [
            { name: 'Koyambedu', location: { lat: 13.0697, lng: 80.1968 } },
            { name: 'Ashok Nagar', location: { lat: 13.0294, lng: 80.2186 } },
            { name: 'Saidapet', location: { lat: 13.0100, lng: 80.2290 } },
            { name: 'Mylapore', location: { lat: 12.9994, lng: 80.2400 } },
        ],
    },
    {
        id: 'r7', name: 'Route 707', origin: 'Sholinganallur', destination: 'Madhavaram',
        estimatedDuration: 60, distance: 30, active: true, color: '#14b8a6',
        path: [{"lat":12.900681,"lng":80.227605},{"lat":12.903042,"lng":80.225483},{"lat":12.905211,"lng":80.223600},{"lat":12.907623,"lng":80.221748},{"lat":12.909935,"lng":80.219931},{"lat":12.912149,"lng":80.218211},{"lat":12.914448,"lng":80.216565},{"lat":12.916781,"lng":80.215020},{"lat":12.919242,"lng":80.213553},{"lat":12.921764,"lng":80.212197},{"lat":12.924219,"lng":80.211022},{"lat":12.926795,"lng":80.210020},{"lat":12.929264,"lng":80.209212},{"lat":12.931769,"lng":80.208564},{"lat":12.934389,"lng":80.208178},{"lat":12.937038,"lng":80.207967},{"lat":12.939653,"lng":80.207859},{"lat":12.942290,"lng":80.207888},{"lat":12.944938,"lng":80.208095},{"lat":12.947547,"lng":80.208459},{"lat":12.950125,"lng":80.208913},{"lat":12.952659,"lng":80.209413},{"lat":12.955276,"lng":80.209984},{"lat":12.957751,"lng":80.210529},{"lat":12.960218,"lng":80.211195},{"lat":12.962737,"lng":80.211863},{"lat":12.965174,"lng":80.212549},{"lat":12.967682,"lng":80.213201},{"lat":12.970055,"lng":80.213883},{"lat":12.972499,"lng":80.214542},{"lat":12.974982,"lng":80.215217},{"lat":12.977359,"lng":80.215974},{"lat":12.979758,"lng":80.216651},{"lat":12.982189,"lng":80.217336},{"lat":12.984534,"lng":80.218028},{"lat":12.986969,"lng":80.218753},{"lat":12.989330,"lng":80.219441},{"lat":12.991813,"lng":80.220213},{"lat":12.994179,"lng":80.220985},{"lat":12.996614,"lng":80.221768},{"lat":12.999002,"lng":80.222519},{"lat":13.001404,"lng":80.223317},{"lat":13.003816,"lng":80.224096},{"lat":13.006232,"lng":80.224879},{"lat":13.008697,"lng":80.225555},{"lat":13.011083,"lng":80.226234},{"lat":13.013506,"lng":80.226834},{"lat":13.015907,"lng":80.227440},{"lat":13.018285,"lng":80.228067},{"lat":13.020689,"lng":80.228628},{"lat":13.023040,"lng":80.229256},{"lat":13.025398,"lng":80.229779},{"lat":13.027783,"lng":80.230301},{"lat":13.030157,"lng":80.230905},{"lat":13.032539,"lng":80.231419},{"lat":13.034937,"lng":80.231767},{"lat":13.037298,"lng":80.232193},{"lat":13.039705,"lng":80.232593},{"lat":13.042060,"lng":80.233101},{"lat":13.044440,"lng":80.233616},{"lat":13.046807,"lng":80.234141},{"lat":13.049181,"lng":80.234548},{"lat":13.051545,"lng":80.234958},{"lat":13.053898,"lng":80.235434},{"lat":13.056187,"lng":80.235925},{"lat":13.058545,"lng":80.236303},{"lat":13.060897,"lng":80.236700},{"lat":13.063277,"lng":80.237034},{"lat":13.065626,"lng":80.237384},{"lat":13.067960,"lng":80.237758},{"lat":13.070280,"lng":80.238148},{"lat":13.072639,"lng":80.238427},{"lat":13.074974,"lng":80.238759},{"lat":13.077331,"lng":80.238986},{"lat":13.079664,"lng":80.239242},{"lat":13.082008,"lng":80.239526},{"lat":13.084362,"lng":80.239847},{"lat":13.086726,"lng":80.240190},{"lat":13.089054,"lng":80.240583},{"lat":13.091395,"lng":80.241005},{"lat":13.093751,"lng":80.241490},{"lat":13.096099,"lng":80.242013},{"lat":13.098433,"lng":80.242628},{"lat":13.100808,"lng":80.243256},{"lat":13.103154,"lng":80.243951},{"lat":13.105476,"lng":80.244679}],
        stops: [
            { name: 'Sholinganallur', location: { lat: 12.9007, lng: 80.2276 } },
            { name: 'Perungudi', location: { lat: 12.9614, lng: 80.2118 } },
            { name: 'Guindy', location: { lat: 13.0068, lng: 80.2231 } },
            { name: 'Anna Nagar', location: { lat: 13.0892, lng: 80.2406 } },
            { name: 'Madhavaram', location: { lat: 13.1055, lng: 80.2447 } },
        ],
    },
];

// ── Mock Buses ───────────────────────────────────────────────────────────────
// Helper to pick a waypoint at a given fraction along a route path
const routeWaypoint = (routeIndex: number, fraction: number = 0): { lat: number; lng: number } => {
    const r = MOCK_ROUTES[routeIndex];
    const pts = r.path && r.path.length > 0 ? r.path : r.stops.map(s => s.location);
    const idx = Math.min(Math.floor(pts.length * fraction), pts.length - 1);
    return { lat: pts[idx].lat, lng: pts[idx].lng };
};

export const MOCK_BUSES: Bus[] = [
    {
        id: 'b1', busNumber: 'TN-01-AB-1234', capacity: 50, status: 'active',
        currentLocation: routeWaypoint(0, 0),       // r1 start
        locationHistory: [],
        conductorId: 'u3', routeId: 'r1',
        speed: 32, passengerCount: 28, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b2', busNumber: 'TN-01-CD-5678', capacity: 45, status: 'active',
        currentLocation: routeWaypoint(1, 0),       // r2 start
        locationHistory: [],
        conductorId: 'u4', routeId: 'r2',
        speed: 24, passengerCount: 15, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b3', busNumber: 'TN-01-EF-9012', capacity: 40, status: 'active',
        currentLocation: routeWaypoint(2, 0),       // r3 start
        locationHistory: [],
        routeId: 'r3',
        speed: 18, passengerCount: 37, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b4', busNumber: 'TN-02-GH-3456', capacity: 52, status: 'active',
        currentLocation: routeWaypoint(3, 0),       // r4 start
        locationHistory: [],
        routeId: 'r4',
        speed: 41, passengerCount: 8, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b5', busNumber: 'TN-02-IJ-7890', capacity: 48, status: 'active',
        currentLocation: routeWaypoint(4, 0.30),    // r5 ~30% along
        locationHistory: [],
        routeId: 'r5',
        speed: 35, passengerCount: 12, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b6', busNumber: 'TN-03-KL-2345', capacity: 42, status: 'active',
        currentLocation: routeWaypoint(0, 0.40),    // r1 ~40% along
        locationHistory: [],
        routeId: 'r1',
        speed: 28, passengerCount: 22, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b7', busNumber: 'TN-04-MN-6789', capacity: 55, status: 'active',
        currentLocation: routeWaypoint(1, 0.60),    // r2 ~60% along
        locationHistory: [],
        routeId: 'r2',
        speed: 22, passengerCount: 41, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b8', busNumber: 'TN-05-OP-1011', capacity: 40, status: 'active',
        currentLocation: routeWaypoint(2, 0.25),    // r3 ~25% along
        locationHistory: [],
        routeId: 'r3',
        speed: 30, passengerCount: 18, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b9', busNumber: 'TN-06-QR-1213', capacity: 45, status: 'active',
        currentLocation: routeWaypoint(3, 0.80),    // r4 ~80% along
        locationHistory: [],
        routeId: 'r4',
        speed: 33, passengerCount: 29, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b10', busNumber: 'TN-07-ST-1415', capacity: 50, status: 'active',
        currentLocation: routeWaypoint(4, 0.75),    // r5 ~75% along
        locationHistory: [],
        routeId: 'r5',
        speed: 26, passengerCount: 34, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b11', busNumber: 'TN-08-UV-1617', capacity: 48, status: 'active',
        currentLocation: routeWaypoint(5, 0),        // r6 start
        locationHistory: [],
        routeId: 'r6',
        speed: 29, passengerCount: 20, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b12', busNumber: 'TN-09-WX-1819', capacity: 44, status: 'active',
        currentLocation: routeWaypoint(5, 0.55),     // r6 ~55% along
        locationHistory: [],
        routeId: 'r6',
        speed: 31, passengerCount: 33, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b13', busNumber: 'TN-10-YZ-2021', capacity: 52, status: 'active',
        currentLocation: routeWaypoint(6, 0),        // r7 start
        locationHistory: [],
        routeId: 'r7',
        speed: 38, passengerCount: 11, lastUpdated: new Date().toISOString(),
    },
    {
        id: 'b14', busNumber: 'TN-11-AA-2223', capacity: 46, status: 'active',
        currentLocation: routeWaypoint(6, 0.50),     // r7 ~50% along
        locationHistory: [],
        routeId: 'r7',
        speed: 27, passengerCount: 39, lastUpdated: new Date().toISOString(),
    },
];

// ── Mock Trips ───────────────────────────────────────────────────────────────
export const MOCK_TRIPS: Trip[] = [
    {
        id: 't1', busId: 'b1', routeId: 'r1', conductorId: 'u3',
        status: 'active', passengerCount: 28,
        startTime: new Date(Date.now() - 25 * 60000).toISOString(),
        currentLocation: MOCK_BUSES[0].currentLocation,
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
        id: 't2', busId: 'b2', routeId: 'r2', conductorId: 'u4',
        status: 'active', passengerCount: 15,
        startTime: new Date(Date.now() - 12 * 60000).toISOString(),
        currentLocation: MOCK_BUSES[1].currentLocation,
        createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
        id: 't3', busId: 'b3', routeId: 'r3', conductorId: 'u3',
        status: 'completed', passengerCount: 44,
        startTime: new Date(Date.now() - 90 * 60000).toISOString(),
        endTime: new Date(Date.now() - 35 * 60000).toISOString(),
        createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    },
    {
        id: 't4', busId: 'b4', routeId: 'r4', conductorId: 'u4',
        status: 'scheduled', passengerCount: 0,
        createdAt: new Date().toISOString(),
    },
];

// ── Mock Alerts ──────────────────────────────────────────────────────────────
export const MOCK_ALERTS: Alert[] = [
    {
        id: 'a1', severity: 'critical',
        title: 'Bus Breakdown',
        message: 'Bus TN-01-AB-1234 reported a breakdown near Guindy. Conductor notified.',
        busId: 'b1', routeId: 'r1', read: false,
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'a2', severity: 'warning',
        title: 'Heavy Traffic',
        message: 'Heavy traffic on Route 202 near T. Nagar. Expect 15 min delay.',
        routeId: 'r2', read: false,
        createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    },
    {
        id: 'a3', severity: 'info',
        title: 'New Route Available',
        message: 'Route 505 (Porur → T. Nagar) launches tomorrow.',
        routeId: 'r5', read: true,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'a4', severity: 'success',
        title: 'All Systems Operational',
        message: 'All backend services and 4 buses are running normally.',
        read: true,
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    },
];

// ── Service helpers ──────────────────────────────────────────────────────────
/** Simulates API latency */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
    getBuses: async (): Promise<Bus[]> => { await delay(200); return [...MOCK_BUSES]; },
    getRoutes: async (): Promise<Route[]> => { await delay(180); return [...MOCK_ROUTES]; },
    getTrips: async (): Promise<Trip[]> => { await delay(220); return [...MOCK_TRIPS]; },
    getAlerts: async (): Promise<Alert[]> => { await delay(150); return [...MOCK_ALERTS]; },
    getUsers: async (): Promise<User[]> => { await delay(200); return [...MOCK_USERS]; },
    getBusById: async (id: string): Promise<Bus | undefined> => {
        await delay(100);
        return MOCK_BUSES.find(b => b.id === id);
    },
};
