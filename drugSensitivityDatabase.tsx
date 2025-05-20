import { useState } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "/components/ui/select";
import { X, ExternalLink, Info } from "lucide-react";

type DrugSensitivityData = {
  id: string;
  drugName: string;
  cellLine: string;
  sensitivityScore: number;
  biomarkers: string[];
  tissueType: string;
  dataset: string;
  drugClass: string;
  ic50?: number;
  reference?: string;
};

// Function to generate random drug sensitivity data
const generateDrugSensitivityData = (count: number): DrugSensitivityData[] => {
  const drugs = [
    'Paclitaxel', 'Cisplatin', '5-Fluorouracil', 'Doxorubicin', 'Erlotinib',
    'Gemcitabine', 'Imatinib', 'Oxaliplatin', 'Tamoxifen', 'Vemurafenib',
    'Irinotecan', 'Docetaxel', 'Bortezomib', 'Sorafenib', 'Cetuximab',
    'Pembrolizumab', 'Nivolumab', 'Olaparib', 'Venetoclax', 'Rituximab'
  ];
  
  const cellLines = [
    'MCF-7', 'A549', 'HT-29', 'MDA-MB-231', 'PC-9',
    'PANC-1', 'K562', 'HCT-116', 'T47D', 'A375',
    'HepG2', 'U87', 'SKOV3', 'DU145', 'OVCAR-3',
    'BT-474', 'SW480', 'LN-229', 'SKBR-3', 'NCI-H460'
  ];
  
  const tissueTypes = [
    'Breast', 'Lung', 'Colon', 'Pancreas', 'Leukemia',
    'Melanoma', 'Liver', 'Brain', 'Ovary', 'Prostate',
    'Bladder', 'Kidney', 'Stomach', 'Esophagus', 'Cervix'
  ];
  
  const datasets = ['CCLE', 'GDSC', 'CellMiner'];
  
  const drugClasses = [
    'Taxane', 'Platinum', 'Antimetabolite', 'Anthracycline', 'EGFR inhibitor',
    'BRAF inhibitor', 'Topoisomerase inhibitor', 'Proteasome inhibitor', 'SERM', 'PARP inhibitor',
    'BCL-2 inhibitor', 'Anti-CD20', 'PD-1 inhibitor', 'VEGF inhibitor', 'ALK inhibitor'
  ];
  
  const biomarkers = [
    'TUBB3', 'ABCB1', 'ERCC1', 'BRCA1', 'TYMS',
    'DPYD', 'TOP2A', 'EGFR', 'RRM1', 'DCK',
    'BCR-ABL', 'GSTP1', 'ESR1', 'CYP2D6', 'BRAF V600E',
    'KRAS', 'NRAS', 'PIK3CA', 'PTEN', 'TP53',
    'HER2', 'PD-L1', 'MSI', 'TMB', 'ALK'
  ];
  
  const data: DrugSensitivityData[] = [];
  
  for (let i = 0; i < count; i++) {
    const drugIndex = Math.floor(Math.random() * drugs.length);
    const cellLineIndex = Math.floor(Math.random() * cellLines.length);
    const tissueIndex = Math.floor(Math.random() * tissueTypes.length);
    const datasetIndex = Math.floor(Math.random() * datasets.length);
    const drugClassIndex = Math.floor(Math.random() * drugClasses.length);
    
    // Generate 1-3 random biomarkers
    const shuffledBiomarkers = [...biomarkers].sort(() => 0.5 - Math.random());
    const selectedBiomarkers = shuffledBiomarkers.slice(0, Math.floor(Math.random() * 3) + 1);
    
    data.push({
      id: ds-${i + 1},
      drugName: drugs[drugIndex],
      cellLine: cellLines[cellLineIndex],
      sensitivityScore: parseFloat((Math.random() * 0.9 + 0.1).toFixed(2)), // 0.1-1.0
      biomarkers: selectedBiomarkers,
      tissueType: tissueTypes[tissueIndex],
      dataset: datasets[datasetIndex],
      drugClass: drugClasses[drugClassIndex],
      ic50: parseFloat((Math.random() * 10).toFixed(4)), // 0-10 Î¼M
      reference: PMID: ${Math.floor(Math.random() * 90000000) + 10000000}
    });
  }
  
  return data;
};

export default function DrugSensitivityDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedBiomarker, setHighlightedBiomarker] = useState<string | null>(null);
  const [tissueFilter, setTissueFilter] = useState<string>('all');
  const [datasetFilter, setDatasetFilter] = useState<string>('all');
  const [drugClassFilter, setDrugClassFilter] = useState<string>('all');

  // Generate 10,000 records of data
  const drugSensitivityData = generateDrugSensitivityData(10000);

  // Extract all unique values for filtering
  const biomarkers = Array.from(new Set(drugSensitivityData.flatMap(item => item.biomarkers)));
  const tissueTypes = Array.from(new Set(drugSensitivityData.map(item => item.tissueType)));
  const datasets = Array.from(new Set(drugSensitivityData.map(item => item.dataset)));
  const drugClasses = Array.from(new Set(drugSensitivityData.map(item => item.drugClass)));

  // Filter data
  const filteredData = drugSensitivityData.filter(item => {
    const matchesSearch = 
      item.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cellLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.biomarkers.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTissue = 
      tissueFilter === 'all' || item.tissueType === tissueFilter;
    
    const matchesDataset = 
      datasetFilter === 'all' || item.dataset === datasetFilter;
    
    const matchesDrugClass = 
      drugClassFilter === 'all' || item.drugClass === drugClassFilter;
    
    const matchesBiomarker = 
      !highlightedBiomarker || item.biomarkers.includes(highlightedBiomarker);
    
    return matchesSearch && matchesTissue && matchesDataset && matchesDrugClass && matchesBiomarker;
  });

  // Bio-tools resources
  const bioTools = [
    { name: "CellMiner", url: "https://discover.nci.nih.gov/cellminer/", icon: "ð§ª" },
    { name: "GDSC", url: "https://www.cancerrxgene.org/", icon: "ð§¬" },
    { name: "CCLE", url: "https://portals.broadinstitute.org/ccle", icon: "ð¬" },
    { name: "cBioPortal", url: "https://www.cbioportal.org/", icon: "ð§«" },
    { name: "OncoLens", url: "https://www.oncolens.com/", icon: "ðï¸" },
    { name: "TIMER", url: "https://cistrome.sh/", icon: "â±ï¸" }
  ];

  // Database statistics
  const dbStats = [
    { label: "Total Drugs", value: drugSensitivityData.length.toLocaleString() },
    { label: "Cell Lines", value: "120+" },
    { label: "Biomarkers", value: biomarkers.length },
    { label: "Tissue Types", value: tissueTypes.length },
    { label: "Last Updated", value: "Jun 2023" },
    { label: "Version", value: "2.1" }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Section with Search and Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Drug Sensitivity Database</h1>
          <div className="text-sm text-gray-500">
            Showing {filteredData.length.toLocaleString()} of {drugSensitivityData.length.toLocaleString()} records
          </div>
        </div>

        {/* 1. Database Search Bar */}
        <div className="mb-4">
          <Input
            placeholder="Search by drug name, cell line, or biomarker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* 2. All Tissue Types and All Datasets Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select value={tissueFilter} onValueChange={setTissueFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Tissue Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tissue Types</SelectItem>
              {tissueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={datasetFilter} onValueChange={setDatasetFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Datasets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Datasets</SelectItem>
              {datasets.map(ds => (
                <SelectItem key={ds} value={ds}>{ds}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={drugClassFilter} onValueChange={setDrugClassFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Drug Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drug Classes</SelectItem>
              {drugClasses.map(dc => (
                <SelectItem key={dc} value={dc}>{dc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Filter by Biomarker */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-700">Filter by Biomarker</h2>
            {highlightedBiomarker && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setHighlightedBiomarker(null)}
                className="text-gray-500"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {biomarkers.map(bm => (
              <Button
                key={bm}
                variant={highlightedBiomarker === bm ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHighlightedBiomarker(bm === highlightedBiomarker ? null : bm)}
              >
                {bm}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - BioTools */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg border p-4 sticky top-4">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              Quick Bio-Tools
            </h2>
            <ul className="space-y-3">
              {bioTools.map(tool => (
                <li key={tool.name}>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{tool.name}</span>
                    <ExternalLink className="h-3 w-3 ml-auto text-gray-400" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Column - Table */}
        <div className="lg:w-2/4">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Drug</TableHead>
                  <TableHead>Cell Line</TableHead>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Sensitivity</TableHead>
                  <TableHead>Biomarkers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.slice(0, 100).map((item) => ( // Display first 100 results for performance
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.drugName}</TableCell>
                      <TableCell>{item.cellLine}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.dataset === 'CCLE' ? 'bg-purple-100 text-purple-800' :
                          item.dataset === 'GDSC' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.dataset}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.sensitivityScore > 0.7 ? 'bg-green-500' :
                                item.sensitivityScore > 0.4 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} 
                              style={{ width: ${item.sensitivityScore * 100}% }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">
                            {item.sensitivityScore.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.biomarkers.map(bm => (
                            <span 
                              key={bm}
                              className={`px-2 py-1 rounded text-xs ${
                                highlightedBiomarker === bm 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {bm}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No matching records found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {filteredData.length > 100 && (
              <div className="p-4 text-center text-sm text-gray-500">
                Showing first 100 of {filteredData.length.toLocaleString()} results
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Database Info */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg border p-4 sticky top-4">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Database Stats
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {dbStats.map(stat => (
                  <div key={stat.label} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Data Sources</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs mr-2">CCLE</span>
                    <span>Cancer Cell Line Encyclopedia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs mr-2">GDSC</span>
                    <span>Genomics of Drug Sensitivity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">NCI-60</span>
                    <span>CellMiner Database</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <Button variant="outline" className="w-full mb-2">
                  Download Dataset
                </Button>
                <Button variant="outline" className="w-full">
                  API Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
