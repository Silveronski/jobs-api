import { generateToastr } from "./generateToastr";
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export const exportJobsToExcel = async (jobs: JobType[]) => {
    if (jobs.length === 0) {
        generateToastr('No jobs!', 'error');
        return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Jobs');
    worksheet.columns = [
        { header: 'Created At', key: 'createdAt', width: 20 },
        { header: 'Position', key: 'position', width: 30 },
        { header: 'Company', key: 'company', width: 30 },
        { header: 'Status', key: 'status', width: 20 }
    ];
    jobs.forEach((job) => {
        worksheet.addRow({
            createdAt: job.createdAt,
            position: job.position,
            company: job.company,
            status: job.status
        });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob(
        [buffer], 
        {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
    );
    saveAs(data, 'jobs.xlsx');
    generateToastr('Jobs exported successfully!', 'success');
}