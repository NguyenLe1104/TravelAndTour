import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsController', () => {
    let controller: BookingsController;
    let service: BookingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookingsController],
            providers: [
                {
                    provide: BookingsService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        updateStatus: jest.fn(),
                        cancel: jest.fn(),
                        getBookingsByTour: jest.fn(),
                        getBookingStats: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<BookingsController>(BookingsController);
        service = module.get<BookingsService>(BookingsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a booking', async () => {
            const req = { user: { id: 1 } };
            const createBookingDto: CreateBookingDto = {
                tourId: 1,
                quantity: 2,
                travelers: [
                    { fullName: 'John Doe', gender: 'MALE' as const },
                    { fullName: 'Jane Doe', gender: 'FEMALE' as const },
                ],
            };

            const mockResult = {
                id: 1,
                userId: 1,
                tourId: 1,
                quantity: 2,
            };

            (service.create as jest.Mock).mockResolvedValue(mockResult);

            const result = await controller.create(req, createBookingDto);
            expect(result).toBeDefined();
            expect(result).toEqual(mockResult);
            expect(service.create).toHaveBeenCalledWith(1, createBookingDto);
        });
    });

    describe('findAll', () => {
        it('should return array of bookings', async () => {
            const req = { user: { id: 1 } };

            (service.findAll as jest.Mock).mockResolvedValue([]);

            const result = await controller.findAll(req);
            expect(result).toBeDefined();
            expect(service.findAll).toHaveBeenCalledWith(1);
        });
    });
});
