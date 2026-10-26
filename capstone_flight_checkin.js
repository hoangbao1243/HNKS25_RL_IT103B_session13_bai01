const readline = require('readline-sync');

let tickets = [
    { pnr: 'VN123', passengerName: 'NGUYEN VAN A', flightClass: 'ECONOMY', status: 'BOOKED', weight: 0, fee: 0 },
    { pnr: 'VN456', passengerName: 'TRAN THI B', flightClass: 'BUSINESS', status: 'BOOKED', weight: 0, fee: 0 },
    { pnr: 'VN789', passengerName: 'LE VAN C', flightClass: 'ECONOMY', status: 'CHECKED_IN', weight: 25, fee: 250000 }
];

function findTicketByPnr(pnr) {
    return tickets.find(t => t.pnr.toUpperCase() === pnr.toUpperCase());
}

function calculateExcessBaggageFee(flightClass, weight) {
    let allowance = flightClass === 'BUSINESS' ? 30 : 20;
    let excess = Math.max(0, weight - allowance);
    return excess * 50000;
}

function listTickets() {
    console.log('\n' + '='.repeat(80));
    console.log('DANH SÁCH VÉ CHUYẾN BAY'.padStart(50, ' '));
    console.log('='.repeat(80));
    console.log(
        'PNR'.padEnd(10) + 
        'HÀNH KHÁCH'.padEnd(25) + 
        'HẠNG VÉ'.padEnd(12) + 
        'TRẠNG THÁI'.padEnd(15) + 
        'TL (KG)'.padEnd(10) + 
        'PHÍ (VNĐ)'
    );
    console.log('-'.repeat(80));
    
    tickets.forEach(t => {
        console.log(
            t.pnr.padEnd(10) + 
            t.passengerName.padEnd(25) + 
            t.flightClass.padEnd(12) + 
            t.status.padEnd(15) + 
            String(t.weight).padEnd(10) + 
            t.fee.toLocaleString('vi-VN')
        );
    });
    console.log('='.repeat(80));
}

function checkIn() {
    console.log('\n--- TIẾP NHẬN CHECK-IN & CÂN HÀNH LÝ ---');
    let pnr = readline.question('Nhập mã đặt chỗ (PNR): ').trim();
    let ticket = findTicketByPnr(pnr);

    if (!ticket) {
        console.log('Lỗi: Không tìm thấy mã PNR!');
        return;
    }

    if (ticket.status === 'CANCELLED') {
        console.log('Lỗi: Vé đã bị hủy, không thể check-in!');
        return;
    }

    if (ticket.status === 'CHECKED_IN') {
        console.log('Thông báo: Hành khách này đã hoàn tất thủ tục trước đó!');
        displayBoardingPass(ticket);
        return;
    }

    let weightInput = readline.question('Nhập tổng trọng lượng hành lý (kg): ');
    let weight = parseFloat(weightInput);

    if (isNaN(weight) || weight < 0) {
        console.log('Lỗi: Trọng lượng hành lý không hợp lệ!');
        return;
    }

    let fee = calculateExcessBaggageFee(ticket.flightClass, weight);

    ticket.weight = weight;
    ticket.fee = fee;
    ticket.status = 'CHECKED_IN';

    console.log('Check-in thành công!');
    if (fee > 0) {
        console.log(`Phát sinh cước quá cân: ${fee.toLocaleString('vi-VN')} VNĐ`);
    } else {
        console.log('Hành lý trong hạn mức miễn cước.');
    }

    displayBoardingPass(ticket);
}

function searchTicket() {
    console.log('\n--- TRA CỨU VÉ ---');
    let keyword = readline.question('Nhập mã PNR hoặc tên hành khách: ').trim().toLowerCase();
    
    let results = tickets.filter(t => 
        t.pnr.toLowerCase().includes(keyword) || 
        t.passengerName.toLowerCase().includes(keyword)
    );

    if (results.length === 0) {
        console.log('Không tìm thấy kết quả phù hợp.');
        return;
    }

    console.log('\nKẾT QUẢ TRA CỨU:');
    results.forEach(t => {
        console.log(`- PNR: ${t.pnr} | Tên: ${t.passengerName} | Hạng: ${t.flightClass} | Trạng thái: ${t.status} | Hành lý: ${t.weight}kg`);
    });
}

function cancelTicket() {
    console.log('\n--- HỦY VÉ ---');
    let pnr = readline.question('Nhập mã PNR cần hủy: ').trim();
    let ticket = findTicketByPnr(pnr);

    if (!ticket) {
        console.log('Lỗi: Không tìm thấy mã PNR!');
        return;
    }

    if (ticket.status === 'CANCELLED') {
        console.log('Vé này đã ở trạng thái hủy từ trước.');
        return;
    }

    let confirm = readline.question(`Bạn có chắc chắn muốn hủy vé của ${ticket.passengerName} (Y/N)? `).trim().toUpperCase();
    if (confirm === 'Y') {
        ticket.status = 'CANCELLED';
        ticket.weight = 0;
        ticket.fee = 0;
        console.log('Đã hủy vé thành công.');
    } else {
        console.log('Hủy thao tác.');
    }
}

function displayBoardingPass(ticket) {
    const width = 46;
    const line = '='.repeat(width);
    const dash = '-'.repeat(width);

    console.log(`\n${line}`);
    console.log(`${'THẺ LÊN MÁY BAY (BOARDING PASS)'.padStart(38, ' ')}`);
    console.log(`${line}`);
    console.log(` Hành khách: ${ticket.passengerName.padEnd(31)}`);
    console.log(` Mã PNR:     ${ticket.pnr.padEnd(31)}`);
    console.log(` Hạng vé:    ${ticket.flightClass.padEnd(31)}`);
    console.log(` Trạng thái: ${ticket.status.padEnd(31)}`);
    console.log(` Hành lý:    ${String(ticket.weight + ' kg').padEnd(31)}`);
    console.log(` Phí quá cước: ${ticket.fee.toLocaleString('vi-VN') + ' VNĐ'}`);
    console.log(`${line}\n`);
}

function main() {
    let choice;
    do {
        console.log('\n================ HỆ THỐNG QUẢN LÝ QUẦY CHECK-IN ================');
        console.log('1. Hiển thị danh sách vé chuyến bay');
        console.log('2. Tiếp nhận check-in & cân hành lý');
        console.log('3. Tra cứu vé theo PNR hoặc tên');
        console.log('4. Hủy vé');
        console.log('5. Thoát chương trình');
        console.log('================================================================');
        
        let input = readline.question('Nhập lựa chọn của bạn (1-5): ').trim();
        choice = parseInt(input);

        switch (choice) {
            case 1:
                listTickets();
                break;
            case 2:
                checkIn();
                break;
            case 3:
                searchTicket();
                break;
            case 4:
                cancelTicket();
                break;
            case 5:
                console.log('Thoát ca làm việc. Hẹn gặp lại!');
                break;
            default:
                console.log('Lựa chọn không hợp lệ! Vui lòng nhập từ 1 đến 5.');
        }
    } while (choice !== 5);
}

main();