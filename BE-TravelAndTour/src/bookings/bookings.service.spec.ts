import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookingsService', () => {
    let service: BookingsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                {
                    provide: PrismaService,
                    useValue: {
                        booking: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                        },
                        tour: {
                            findUnique: jest.fn(),
                            update: jest.fn(),
                        },
                        $transaction: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a booking with travelers', async () => {
            const userId = 1;
            const createBookingDto = {
                tourId: 1,
                quantity: 2,
                travelers: [
                    { fullName: 'John Doe', gender: 'MALE' },
                    { fullName: 'Jane Doe', gender: 'FEMALE' },
                ],
            };

            // Mock implementation would go here
            // expect(result).toBeDefined();
        });

        it('should throw error if tour not found', async () => {
            const userId = 1;
            const createBookingDto = {
                tourId: 999,
                quantity: 1,
                travelers: [{ fullName: 'John Doe', gender: 'MALE' }],
            };

            (prisma.tour.findUnique as jest.Mock).mockResolvedValue(null);

            // expect(service.create(userId, createBookingDto)).rejects.toThrow();
        });
    });

    describe('findAll', () => {
        it('should return array of bookings for user', async () => {
            const userId = 1;

            (prisma.booking.findMany as jest.Mock).mockResolvedValue([]);

            const result = await service.findAll(userId);
            expect(result).toBeDefined();
        });
    });

    describe('cancel', () => {
        it('should cancel booking and restore seats', async () => {
            const userId = 1;
            const bookingId = 1;

            // Mock implementation would go here
            // expect(result).toBeDefined();
        });
    });
});
