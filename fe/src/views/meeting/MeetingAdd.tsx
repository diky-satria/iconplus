import {
  Breadcrumb,
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "../../interceptors/axios";
import {
  TErrors,
  TKonsumsi,
  TKonsumsiOption,
  TRoom,
  TRoomOption,
  TUnit,
  TUnitOption,
} from "../../datatype";
import dayjs, { Dayjs } from "dayjs";
import ToastError from "../../components/ToastError";
import { VErrors } from "../../datatype/value";
import ToastSuccess from "../../components/ToastSuccess";
import Cookies from "js-cookie";

const masterTime = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function MeetingAdd() {
  const token = Cookies.get("authToken");
  const navigate = useNavigate();

  const [masterUnit, setMasterUnit] = useState<TUnitOption[]>([]);
  const [masterRoom, setMasterRoom] = useState<TRoomOption[]>([]);
  const [masterKonsumsi, setMasterKonsumsi] = useState<TKonsumsiOption[]>([]);
  const [idUnit, setIdUnit] = useState<string>("");
  const [namaUnit, setNamaUnit] = useState<string>("");
  const [idRoom, setIdRoom] = useState<string>("");
  const [namaRoom, setNamaRoom] = useState<string>("");
  const [kapasitas, setKapasitas] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(0);
  const [selectedKonsumsi, setSelectedKonsumsi] = useState<TKonsumsiOption[]>(
    []
  );
  const [nominal, setNominal] = useState<number>(0);

  const [errors, setErrors] = useState<TErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // HANDLE NOMINAL
    let nominal = 0;
    for (let i = 0; i < selectedKonsumsi.length; i++) {
      nominal += selectedKonsumsi[i].harga;
    }
    const nominalResult = nominal * jumlahPeserta;
    setNominal(nominalResult);
  }, [jumlahPeserta, selectedKonsumsi]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice`
      );
      let data = response.data;
      if (data.length > 0) {
        data = data.map((item: TUnit) => {
          return {
            value: item.id,
            label: item.officeName,
          };
        });
        setMasterUnit(data);
      }

      const responseKonsumsi = await axios.get(
        `https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi`
      );
      let dataKonsumsi = responseKonsumsi.data;
      if (dataKonsumsi.length > 0) {
        dataKonsumsi = dataKonsumsi.map((item: TKonsumsi) => {
          return {
            id: item.id,
            value: item.id,
            label: item.name,
            harga: item.maxPrice,
          };
        });
        setMasterKonsumsi(dataKonsumsi);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error ", error);
    }
  };

  const onChangeSelectUnit = async (value: string) => {
    setMasterRoom([]);
    setIdRoom("");
    setKapasitas(0);
    setJumlahPeserta(0);
    setNominal(0);
    if (masterUnit.length > 0) {
      const selectedUnit: TUnitOption[] = masterUnit.filter(
        (item: TUnitOption) => item.value === value
      );
      if (selectedUnit.length > 0) {
        setIdUnit(selectedUnit[0].value);
        setNamaUnit(selectedUnit[0].label);

        try {
          const response = await axios.get(
            `https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms`
          );
          let data = response.data;
          if (data.length > 0) {
            data = data.filter(
              (item: TRoom) => item.officeId === selectedUnit[0].value
            );
            data = data.map((item: TRoom) => {
              return {
                value: item.id,
                label: item.roomName,
                kapasitas: item.capacity,
              };
            });
            setMasterRoom(data);
          }
        } catch (error) {
          console.log("error ", error);
        }
      }
    }
  };
  const onChangeSelectRoom = (value: string) => {
    if (masterRoom.length > 0) {
      const selectedRoom: TRoomOption[] = masterRoom.filter(
        (item: TRoomOption) => item.value === value
      );
      if (selectedRoom.length > 0) {
        setIdRoom(selectedRoom[0].value);
        setNamaRoom(selectedRoom[0].label);
        setKapasitas(selectedRoom[0].kapasitas);
        setJumlahPeserta(0);
        setNominal(0);
      }
    }
  };
  const onChangeDate = (date: Dayjs | null) => {
    setSelectedDate(date);
  };
  const disabledDate = (current: Dayjs) => {
    return current.isBefore(dayjs().startOf("day"));
  };

  const onChangeSelectStartTime = (value: string) => {
    if (!selectedDate) {
      ToastError("Pilih tanggal rapat terlebih dahulu!", "top-right");
      setStartTime("");
      setEndTime("");
      return;
    }

    const now = dayjs();
    const selectedDateTime = selectedDate.hour(parseInt(value.split(":")[0]));

    if (selectedDateTime.isBefore(now)) {
      ToastError(
        "Waktu mulai tidak boleh lebih kecil dari waktu saat ini!",
        "top-right"
      );
      setStartTime("");
      return;
    }

    if (
      endTime &&
      selectedDateTime.isAfter(
        selectedDate.hour(parseInt(endTime.split(":")[0]))
      )
    ) {
      ToastError(
        "Waktu mulai tidak boleh lebih besar dari waktu selesai!",
        "top-right"
      );
      setStartTime("");
      return;
    }

    setStartTime(value);
    updateKonsumsi(value, endTime);
  };

  const onChangeSelectEndTime = (value: string) => {
    if (!startTime) {
      ToastError("Pilih waktu mulai terlebih dahulu!", "top-right");
      setEndTime("");
      return;
    }

    const startDateTime = selectedDate!.hour(parseInt(startTime.split(":")[0]));
    const endDateTime = selectedDate!.hour(parseInt(value.split(":")[0]));

    if (endDateTime.isBefore(startDateTime)) {
      ToastError(
        "Waktu selesai tidak boleh lebih kecil dari waktu mulai!",
        "top-right"
      );
      setEndTime("");
      return;
    }

    setEndTime(value);
    updateKonsumsi(startTime, value);
  };

  const validateJumlahPeserta = (e: number) => {
    const value = e ? e : 0;
    if (!idUnit) {
      ToastError("Pilih Unit terlebih dahulu!", "top-right");
      setJumlahPeserta(0);
      return;
    }
    if (!idRoom) {
      ToastError("Pilih Ruangan terlebih dahulu!", "top-right");
      setJumlahPeserta(0);
      return;
    }
    if (!selectedDate) {
      ToastError("Pilih tanggal rapat terlebih dahulu!", "top-right");
      setJumlahPeserta(0);
      return;
    }
    if (!startTime) {
      ToastError("Pilih waktu mulai terlebih dahulu!", "top-right");
      setJumlahPeserta(0);
      return;
    }
    if (!endTime) {
      ToastError("Pilih waktu selesai terlebih dahulu!", "top-right");
      setJumlahPeserta(0);
      return;
    }
    if (value !== 0 && kapasitas !== 0 && value > kapasitas) {
      ToastError(
        "Jumlah Peserta tidak boleh lebih dari Kapasitas!",
        "top-right"
      );
      setJumlahPeserta(0);
      return;
    }
    setJumlahPeserta(value);
  };

  const updateKonsumsi = (start: string | null, end: string | null) => {
    if (!start || !end) return;

    const startHour = parseInt(start.split(":")[0], 10);
    const endHour = parseInt(end.split(":")[0], 10);
    const konsumsi: string[] = [];

    if (startHour < 11 || endHour >= 11) {
      konsumsi.push("1"); // Snack Siang
    }
    if (
      (startHour >= 11 && startHour <= 14) ||
      (endHour >= 11 && endHour <= 14)
    ) {
      konsumsi.push("2"); // Makan Siang
    }
    if (startHour >= 14 || endHour > 14) {
      konsumsi.push("3"); // Snack Sore
    }

    const konsumsiData = masterKonsumsi.filter((item) =>
      konsumsi.includes(item.id)
    );
    setSelectedKonsumsi(konsumsiData);
  };

  const toAddMeeting = async () => {
    setErrors(VErrors);
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/meeting`,
        {
          id_unit: idUnit,
          nama_unit: namaUnit,
          id_ruangan: idRoom,
          nama_ruangan: namaRoom,
          kapasitas: kapasitas,
          tanggal: selectedDate?.format("YYYY-MM-DD"),
          waktu_mulai: startTime,
          waktu_selesai: endTime,
          jumlah_peserta: jumlahPeserta,
          konsumsi: selectedKonsumsi,
          nominal: nominal,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      navigate("/meeting");
      ToastSuccess(response.data.msg, "top-right");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrors(error.response.data.errors);
      setLoading(false);
    }
  };

  return (
    <Div>
      <div className="c-content-top">
        <div className="c-content-top-left">
          <Button
            className="c-primary"
            type="primary"
            size="large"
            onClick={() => navigate("/meeting")}
          >
            <LeftOutlined />
          </Button>
          <div>
            <h3>Ruang Meeting</h3>
            <Breadcrumb
              items={[
                {
                  title: (
                    <span onClick={() => navigate("/meeting")}>
                      Ruang Meeting
                    </span>
                  ),
                },
                {
                  title: (
                    <span onClick={() => navigate("/meeting_add")}>
                      Pesan Ruangan
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="c-content-bottom">
        <div className="c-content-bottom-top">
          <h4>Informasi Ruang Meeting</h4>
          <div className="row">
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Unit
              </div>
              <Select
                size="large"
                showSearch
                placeholder="Pilih Unit"
                optionFilterProp="label"
                onChange={onChangeSelectUnit}
                options={masterUnit}
                value={idUnit}
              />
              {errors && errors.param === "id_unit" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Ruang Meeting
              </div>
              <Select
                size="large"
                showSearch
                placeholder="Pilih Ruang Meeting"
                optionFilterProp="label"
                onChange={onChangeSelectRoom}
                options={masterRoom}
                value={idRoom}
              />
              {errors && errors.param === "id_ruangan" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Kapasitas
              </div>
              <Input
                size="large"
                placeholder="0"
                type="number"
                disabled
                value={kapasitas}
              />
            </div>
          </div>
        </div>

        <hr style={{ margin: "30px 0", border: "2px solid #d9d9d9" }} />

        <div className="c-content-bottom-middle">
          <h4>Informasi Rapat</h4>
          <div className="row">
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Tanggal Rapat
              </div>
              <DatePicker
                size="large"
                onChange={onChangeDate}
                value={selectedDate}
                disabledDate={disabledDate}
              />
              {errors && errors.param === "tanggal" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Waktu Mulai
              </div>
              <Select
                size="large"
                showSearch
                placeholder="Pilih Waktu Mulai"
                optionFilterProp="label"
                onChange={onChangeSelectStartTime}
                options={masterTime}
                value={startTime}
              />
              {errors && errors.param === "waktu_mulai" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Waktu Selesai
              </div>
              <Select
                size="large"
                showSearch
                placeholder="Pilih Waktu Selesai"
                optionFilterProp="label"
                onChange={onChangeSelectEndTime}
                options={masterTime}
                value={endTime}
              />
              {errors && errors.param === "waktu_selesai" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Jumlah Peserta
              </div>
              <Input
                size="large"
                placeholder="0"
                type="number"
                value={jumlahPeserta}
                onChange={(e) => validateJumlahPeserta(Number(e.target.value))}
              />
              {errors && errors.param === "jumlah_peserta" ? (
                <p className="text-danger">{errors.msg}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
              Jenis Konsumsi
            </div>
            {masterKonsumsi.length > 0 &&
              masterKonsumsi.map((item: TKonsumsiOption, index: number) => {
                return (
                  <Checkbox
                    key={index}
                    checked={selectedKonsumsi.some(
                      (konsumsi) => konsumsi.id === item.id
                    )}
                    disabled
                    className="mt-1"
                    style={{ cursor: "not-allowed" }}
                  >
                    {item.label}
                  </Checkbox>
                );
              })}
          </div>
          <div className="row">
            <div className="col-12 col-lg-2">
              <div className="mt-3 fw-bold" style={{ color: "#333333" }}>
                Nominal Konsumsi
              </div>
              <InputNumber
                addonBefore={"Rp."}
                style={{ width: "100%" }}
                size="large"
                value={nominal}
                disabled
              />
            </div>
          </div>
        </div>

        <hr style={{ margin: "30px 0", border: "2px solid #d9d9d9" }} />

        <div className="c-content-bottom-bottom">
          <Button
            color="danger"
            variant="text"
            size="large"
            onClick={() => navigate("/meeting")}
          >
            Batal
          </Button>
          <Button
            className="c-primary"
            type="primary"
            size="large"
            onClick={() => toAddMeeting()}
            disabled={loading}
            loading={loading}
          >
            Simpan
          </Button>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  .c-content-top-left {
    display: flex;
    gap: 20px;
  }
  .c-content-bottom-bottom {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
`;
